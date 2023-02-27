/* VENTAJAS
 *
 * Este metodo permite reusar codigo html que ya fue escrito.
 * 
 * La idea es fusionar dos o mas paginas html que tiene head y body.
 * 
 * Ademas se puede revertir, o sea, eliminar todo lo que fue anexado (ver desventajas)
 * 
 * A diferencia de <object>, los componentes de ambas paginas pueden interactuar entre si
 * 
 * A diferencia de html_importer, este codigo permite trabajar con body y head.
 * 
 * 
 * PARA MEJORAR
 * 
 * El manejo de eventos no fue contemplado a la hora de eliminar lo que fue anexado.
 * Eso significa que si se agregaron eventos, por mas que se quiten los nodos agregados, ese
 * codigo se seguira ejecutando.
 * 
 */

/************************************************************************/
/*                  Division del lado del cliente                       */
/************************************************************************/


/* Solucion del lado del cliente con expresiones regulares.
 *
 * Con esta solucion el servidor no se entera del modo en que son usados los archivos.
 *
 * Se pide el archivo completo al servidor, luego, se parsea el string y se agrega el
 * html a head o #tabId segun corresponda.
 * 
 * No sirve la solucion de colocar el archivo en un div y despues seleccionar head o
 * body. Ya que esto proboca que head y body sean eliminados, quedando todos los tag
 * como hijos del div, no como nietos.
 * 
 */
export function loadTab_clientSolution(url, containerQ) {
    // if (navLink.attr('loaded') !== undefined) return;    
    // navLink.attr('loaded', true);    // Cargar por unica vez el contenido de los tab
    var request = $.ajax({
        url: url,
        async: true
    });
    $.when(request).done(function(response) {
        var headContent = response.match(/<head>([\s\S]*?)<\/head>/)[1];
        var bodyContent = response.match(/<body>([\s\S]*?)<\/body>/)[1];
        appendHeadTags(headContent, "tabContent", "true").then( () => { 
            $(containerQ).html(bodyContent);
        });
    });
}


/************************************************************************/
/*                  Division del lado del servidor                      */
/************************************************************************/


/*
 * Se solicita, por separado y mediante de ajax, el contenido del head y del body.
 * 
 */
export function loadTab_serverSolution(url, containerQ) {
    // if (navLink.attr('loaded') !== undefined) return;    
    // navLink.attr('loaded', true);    // Cargar por unica vez el contenido de los tab
    var url = navLink.data('url');
    let headRequest = $.ajax({
        url: url+'/head',
        async: true
    });
    $.when(headRequest).done(function(headRes) {
        appendHeadTags(headRes, "tabContent", "true").then( () => { 
            loadBody(url, containerQ);
        });
    });
}

function loadBody(url, container) {
    $(container).load(url + '/body', function() {
        document.dispatchEvent(new Event('load'));
    });
} 


/************************************************************************/
/*                  Cargar recursos, tags del head                      */
/************************************************************************/


/* Se pueden crear un tag html a partir de strings, tanto con innerHTML,
 * como con $(tag)[0] :
 *      
 *      var elem = $(tag)[0];
 * 
 *      var div = document.createElement('div');
 *      div.innerHTML = htmlString;
 *      var elem = div.firstChild;
 * 
 * Pero, el evento load para <script> no se emite con appendChild si se usan
 * estos dos metodos. Aunque si se emite, por ejemplo, para <link>:
 * 
 *      document.appendChild(elem);
 * 
 * Una forma de emitirlo es con createElement('script'):
 * 
 *      var elem = Alguno_de_los_dos_metodos_anteriores();
 *      var script = document.createElement('script');
 *      script.src = elem.src;
 *      document.head.appendChild(script);
 * 
 * Sin embargo, este metodo no permite trabajar por igual con todos los nodos.
 * Por ese motivo se empleo 'fragment'.
 */
function appendHeadTags(html, allTagsAttr = null, allTagsVal = null) {
    var tags = html.match(/(<(script|link)[^>]+>|<style[^>]*>(.*?)<\/style>)/gms) || [];
    var promises = [];
    tags.forEach(function(tag) {
        const elem = document.createRange().createContextualFragment(tag).firstChild;
        promises.push(loadResources(elem));
        elem.setAttribute(allTagsAttr, allTagsVal);
        document.head.appendChild(elem);
    });
    return new Promise( function(resolve) {
        Promise.all(promises).then( () => { 
            resolve();
        });
    });
}

function loadResources(elem, defer=true) {
    var promise = null;
    if (elem.tagName === 'SCRIPT' || elem.tagName === 'LINK' && elem.rel === 'stylesheet')
        promise = new Promise(function(resolve) {
            $(elem).on('load', function() {
                resolve();
            });
        });
    elem.defer = defer;
    return promise;
}
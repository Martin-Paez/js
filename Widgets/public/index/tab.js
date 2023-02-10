/* tabs.js
 *
 * El contenido (html, css y js) de los tab se encuentra en el servidor.
 *
 * Para que los ejemplos sean independientes la informacion esta en un html con head y body.
 * 
 * Por lo tanto, hay que separar: por un lado, los nodos del body, y, por le otro, los del head.
 *  
 */
document.addEventListener("DOMContentLoaded", function() {

    loadTab_clientSolution($('.nav-link:first'));

    $('.nav-link').on('click', function() {
        /* Cada ejemplo, o sea, el contenido de los tab, deber ser un proyecto independiente. Por
         * ello no deben conozcerse entre si, y por lo tanto, hay que contemplar la posibilidad
         * de que uno interfiera con otro. 
         * En conclusion, si bien es menos eficiente, se tomo la decision de limpiar en contenido 
         * de los tab al cerrarlos y se cargarlos desde cero al abrirlos nuevamente.
         * Del head se eliminan los scripts, ya que pueden ocurrir que esten atentos a un evento que
         * ya no deberian estar escuchando. Los demas nodos se eliminan para mantener la web limpia,
         * esto ayuda a la hora de analizar el codigo para comprender cada ejemplo.
         * 
         */
        $('.tab-pane').each( function(n) {
            $('.tab-pane')[n].innerHTML = "";
        });
        $('head [tabContent="true"]').remove();
        loadTab_serverSolution($(this));
    });

});


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
function loadTab_clientSolution(navLink) {
    // if (navLink.attr('loaded') !== undefined) return;    
    // navLink.attr('loaded', true);    // Cargar por unica vez el contenido de los tab
    var url = navLink.data('url');
    var request = $.ajax({
        url: url,
        async: true
    });
    $.when(request).done(function(response) {
        var headContent = response.match(/<head>([\s\S]*?)<\/head>/)[1];
        var bodyContent = response.match(/<body>([\s\S]*?)<\/body>/)[1];
        appendHeadTags(headContent, "tabContent", "true").then( () => { 
            var tabContainer = navLink.data('bs-target');
            $(tabContainer).html(bodyContent);
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
function loadTab_serverSolution(navLink) {
    // if (navLink.attr('loaded') !== undefined) return;    
    // navLink.attr('loaded', true);    // Cargar por unica vez el contenido de los tab
    var url = navLink.data('url');
    headRequest = $.ajax({
        url: url+'/head',
        async: true
    });
    $.when(headRequest).done(function(headRes) {
        appendHeadTags(headRes, "tabContent", "true").then( () => { 
            loadBody(url, navLink.data('bs-target'));
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
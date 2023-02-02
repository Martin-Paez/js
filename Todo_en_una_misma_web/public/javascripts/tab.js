/* tabs.js
 *
 * El contenido (html, css y js) de los tab se encuentra en el servidor.
 *
 * Para que los ejemplos sean completos, la informacion esta en un html, o sea, con head y body.
 * 
 * Por lo tanto, hay que separar: por un lado, los nodos del body, y, por le otro, los del head.
 *  
 */
document.addEventListener("DOMContentLoaded", function() {

    loadTab($('.nav-link:first'));

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
        loadTab($(this));
    });

});

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
function loadTabb(navLink) {
    if (navLink.attr('loaded')=== undefined)
        navLink.attr('loaded', true);
    else
        return;
    var tabId = navLink.data('bs-target');
    var url = navLink.data('url');
    var request = $.ajax({
        url: url,
        async: true
    });
    $.when(request).done(function(response) {
        var headContent = response.match(/<head>([\s\S]*?)<\/head>/)[1];
        var bodyContent = response.match(/<body>([\s\S]*?)<\/body>/)[1];
        $('head').append(headContent);
        $(tabId).html(bodyContent);
    });
}

/* Solucion del lado del servidor
 *
 * Se solicita, por separado y mediante de ajax, el contenido del head y del body de un determinado archivo.
 * 
 */
function loadTab(navLink) {
    /*
     * En caso de querer cargar por unica vez el contenido de los tab
     *
    if (navLink.attr('loaded')=== undefined)
        navLink.attr('loaded', true);
    else
        return;
     */
    var tabId = navLink.data('bs-target');
    var url = navLink.data('url');
    var headRequest = $.ajax({
        url: url+'/head',
        async: true
    });
    $.when(headRequest).done(function(headRes) {
        var head = $('head');
        var tags = headRes.match(/(<(script|link|style)[^>]+>|<style[^>]*>(.*?)<\/style>)/gms) || [];
        var promises = [];
        tags.forEach(function(tag) {
            var elem = $(tag)[0];
            elem.defer = true;
            if (elem.tagName === 'LINK' && elem.rel === 'stylesheet') {
                var promise = new Promise(function(resolve) {
                    $(elem).on('load', function() {
                        resolve();
                    });
                });
                promises.push(promise);
            } else if (elem.tagName === 'SCRIPT') {     
                // Con jquery los scripts no sesolicitan al servidor sin type='module', ni se emite 'load'
                var script = document.createElement('script');
                script.src = elem.src;
                script.type = elem.type;
                script.defer = true;
                elem = script;
                var promise = new Promise(function(resolve) {
                    script.onload = function() {
                        resolve();
                    };
                });
                promises.push(promise);
            }
            elem.setAttribute("tabContent", "true");
            document.head.appendChild(elem);
        });
        Promise.all(promises).then(function() {
            $(tabId).load(url + '/body', function() {
                var event = new Event('load');
                document.dispatchEvent(event);
            });
        });
    });
}

function loadTabbb(navLink) {
    if (navLink.attr('loaded')=== undefined)
        navLink.attr('loaded', true);
    else
        return;
    var tabId = navLink.data('bs-target');
    var url = navLink.data('url');
    var headRequest = $.ajax({
        url: url+'/head',
        async: true
    });
    $.when(headRequest).done(function(headRes) {
        var tags = headRes.match(/<(script|link)[^>]+>/g) || [];
        loadHead(tags).then( function() {
            $(tabId).load(url + '/body', function() { 
                var event = new Event('load');
                document.dispatchEvent(event);
            });
        });
    });
}

function loadHead(tags) {
    return new Promise( function(resolve) {
        _loadHead(tags, resolve);
    });
}

function _loadHead(tags, resolve) {
    if (0 === tags.length)
        return resolve();
    var elem = $(tags.shift())[0];
    if (elem.tagName === 'LINK' && elem.rel === 'stylesheet') {
        $(elem).on('load', function() {
            _loadHead(tags, resolve);
        });
        $('head').append(elem);
    } else if (elem.tagName === 'SCRIPT') {     
        // Con jquery los scripts no sesolicitan al servidor sin type='module', ni se emite 'load'
        var script = document.createElement('script');
        script.src = elem.src;
        script.onload = function() {
            _loadHead(tags, resolve);
        };
        document.head.appendChild(script);
    } else {
        $('head').append(elem);
        _loadHead(tags, resolve);
    }
}

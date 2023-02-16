import {loadTab_serverSolution} from '/html_importers/hb_importer.mjs'
    
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

    loadTab_serverSolution($('.nav-link:first'));

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
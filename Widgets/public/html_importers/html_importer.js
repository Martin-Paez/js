
/* Importacion, incrustar, HTML
 *
 * Resuelve : 
 * 
 *      <html-import src="archivo.html"></html-import>
 * 
 * Permite reemplazar dicho tag html por el contenido del arhivo especificado.
 *  
 * Basta con importar este archivo y el navegador usara esta clase para resolver
 * los tag <html-import> automaticamente al cargar la pagina :
 *  
 *      <script src="html_importer.js"></script>   
 */

class HTMLImportElement extends HTMLElement {
    connectedCallback() {
      fetch(this.getAttribute('src'))
        .then(res => res.text())
        .then(html => {
            // let body = document.getElementsByTagName('body')[0];
            let div = document.createElement('div');
            div.innerHTML = html;
            while (div.firstChild) {
                //body.appendChild(div.firstChild); // Anexa al final del body
                this.appendChild(div.firstChild);
            };
        })
    }
  }
  
  customElements.define('html-import', HTMLImportElement);


/* Esta verion esta deprecated, porque usa link para importar el html
 *
 *  <link href="icons.html" rel="import">
 * 
document.addEventListener('DOMContentLoaded', function() {
    var imports = document.querySelectorAll('link[rel=import]');
    imports.forEach(e => {
        fetch(e.href)
            .then(res => res.text())
            .then(html => {
                let body = document.getElementsByTagName('body')[0];
                let div = document.createElement('div');
                div.innerHTML = html;
                while (div.firstChild) {
                    body.appendChild(div.firstChild);
                };
            });

    });
});
*/
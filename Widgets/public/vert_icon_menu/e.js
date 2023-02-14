/**
 * Este es un modo simple y eficiente de manejar botons que ocultan y muestran.
 * 
 * Pensado para el evento onclick en los tag html. Implica colocar js embebido y no
 * permite usar el archivo como modulo js. Sin embargo, es un muy simple eh intuitivo.
 * 
 * Ademas, se puede usar desde js, sin embeber codigo.
 * 
 * Es la eficiente, no es necesario recorrer el DOM.
 *
 * Es versatil, la sintaxis css permite listar varios elementos.
 * 
 * @example
 * Ejemplo de uso :
 * 
 *      <button id="show" onclick="switchDsp('#show, .sc','#hide') > Mostrar </button>
 * 
 *      <buttom id="hide" onclick="switchDsp(this, '#show, .sc') > Mostrar </button>
 * 
 *      <div class="sc"> 
 *          Contenido 
 *      </div>
 * 
 * 
 *      Quedaria aun mas compacto usando .sc en vez de #show
 * @end
 * 
 * @example 
 * Ejemplo de uso:
 * 
 *      let show = document.getElementById("#show");
 *      let hide = document.getElementById("#hide");
 *      switchDsp(show, hide);
 * 
 *      Con objetos es valido, ya que se usa JQuery: $(show) = $('#showId')
 * @end
 * 
 * @param { hide } Selector css de elementos que se van a ocultar
 * @param { show } Selector css de elementos que se van mostrar
 * @param { dsp } del atributo Display de css para los elementos de show
 */
function switchDsp(hide, show, dsp = 'block') {}
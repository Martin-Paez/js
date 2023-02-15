/*
 * Es un termometro hecho con HTML, CSS y JavaScript puros (divs y una img de fondo)
 * 
 */
export class ImgThermWidget {

    /* Retorna una promesa, se agrega al documento el codigo html para de un nuevo widget.
     * 
     *  container: Se agrega en el primer tag que conincida con la query en container.
     * 
     *  value: El valor inicial de temperatura .
     * 
     *  imgPath: Se puede cambiar la imagen o donde se almacena, pero el widget funciona
     *           con las dimensiones particulares de termometro.png. Esto implica el 
     *           tamano de la imagen, pero tambien, la altura de la columna maxima de 
     *           liquido.
     * 
     *  height: Altura del widget en px.
     * 
     * Se contemplan dos eventos: uno al terminar de cargarse el div contenedor,
     * o sea, el widget; y el otro, al terminar de cargarse la imagen de fondo.  
     */
    //TODO - Modularizar
    constructor({container = '.itw_container', initTemp = 0, height = 450, style = ""} = {}) {
        var self = this;
        return new Promise( function(resolve, reject) {
            var html = self.widget(height, style);
            // NO SE PUEDE USAR innerHTML - Todas las instancias apuntarian al ultimo instanciado
            const parent = document.createRange().createContextualFragment(html); 
            const widget = parent.firstChild;
            var img = widget.lastChild;
            self.liquid = widget.firstChild;
            $(img).on('load', () => { 
                self.setTemp(initTemp);
                resolve(self); 
            });
            document.querySelector(container).appendChild(widget);
        });
    }

    widget(height, style) {
        return '<div class="_itw_widget" style="height: ' + height + 'px; ' + style + '">' +
            '<div class="_itw_bar"></div>' +    
            '<div class="_itw_circle"></div>' +
            '<img src="./termometro.png" class="_itw_img">' +
        '</div>';
    }

    /*
    * Dibuja el liquido en funcion de la temperatura en el input.
    *
    * Se suma 25 porque el termometro empieza en -25.
    * 
    * Se suma 2.5 ya que equivale a la distancia entre el circulo
    * y la primer marca de la regla.
    * 
    * Es una regla de 3 simple, el 100% es 55 (el maximo). En vez
    * del 100 se coloco un 50, ya que:
    * 
    *      Hay valores negativos.
    *      
    *      La figura del temometro es una porcion del alto de la 
    *      imagen.
    * 
    *      Los valores empleados anteriormente son porcentajes,
    *      no grados centigrados.
    *  
    * Por lo tanto el 100% de la regla de tres simple se determino 
    * experimentalmente, es una casualidad que justo halla dado el 
    * 49%. Lo mismo sucede con el valor maximo. 
    */
    setTemp(value) {
        var value = parseInt(value) + 25;
        if ( value > 80.5 )
            value = 80.5;
        this.liquid.style.height = (value * 55.5 / 55 + 2.5 ) + "%";
    };

}
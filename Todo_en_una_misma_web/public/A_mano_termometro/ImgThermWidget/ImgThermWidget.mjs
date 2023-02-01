//import { MultiEvent } from './MultiEvent.js';
import * as me from './MultiEvent.mjs'

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
    constructor({container = '.ti_container', value = 0, height = 600, imgPath = "./termometro.png"} = {}) {
        var self = this;
        var promise = new Promise( function(resolve, reject) {
            var tiContainer = document.querySelector(container);
            var barW = 11 + '%';
            var circleH = 8.5164 + '%';
            var circleW = 29.014 + '%';
            var html = '<div class="_ti_widget" style="height: ' + height + 'px;">' +
                            '<img src=' + imgPath + ' class="_ti_img">' +
                            '<div class="_ti_circle" style="width:' + circleW + ';height:' + circleH + '"></div>' +
                            '<div class="_ti_bar" style="width:' + barW + '"></div>' +    
                        '</div>'
            // NO SE PUEDE USAR innerHTML
            //      Todas las instancias apuntarian al ultimo instanciado
            const fragment = document.createRange().createContextualFragment(html);
            var widget = fragment.firstChild;
            var img = widget.firstChild;
            var  multiEvent = new me.MultiEvent();
            multiEvent.on('load', () => {
                resolve(self);
            });
            img.addEventListener("load", () => { multiEvent.emit('load'); });
            widget.addEventListener("load", () => { multiEvent.emit('load'); });
            multiEvent.add(2);  // Los agrego antes
            tiContainer.appendChild(widget);
            self.liquid = widget.lastChild;
            self.setTemp(value);
        });
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
        this.liquid.style.height = (value * 49 / 55 + 2.5 ) + "%";
    };

}
/*
 * Es un termometro hecho con HTML, CSS y JavaScript puros (divs y una img de fondo)
 * 
 * eventMgr.notify() se invoca dos veces: una al terminar de cargarse el nuevo nodo,
 * o sea, el widget; y la otra, al terminar de cargarse la imagen de fondo.  
 */
class ImgThermWidget {

    /* Widht del liquido
    * El script se usa porque los div no pueden estar dentro de un <img> 
    */
    constructor({container = '.ti_container', value = 0, height = 600, multiEvent = null,
                 imgPath = "./termometro.png"} = {}) {
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
        //      Todas las instancias apuntarian al mismo nodo, el ultimo instanciado
        const fragment = document.createRange().createContextualFragment(html);
        var widget = fragment.firstChild;
        var img = widget.firstChild;
        if (multiEvent !== null) {
           // multiEvent.add(2);      // Preferible agregarlos primero
            img.addEventListener("load", () => { /*multiEvent.emit('load');*/ });
            document.addEventListener("DOMNodeInserted", () => {/* multiEvent.emit('load');*/ });
        }
        tiContainer.appendChild(widget);
        this.liquid = widget.lastChild;
        this.setTemp(value);
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
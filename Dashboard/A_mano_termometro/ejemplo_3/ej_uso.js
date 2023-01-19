//const MultiEvent = require('multi_event');
/*const EventEmitter = require('events');

class MultiEvent extends EventEmitter {

    constructor() {
        this.n = 0;
        this.map = new Map();
    }

    emit(eventName, ...args) {
        var n = this.map.get(eventName) || 0;
        this.map.set(eventName, --n);
        if (n === 0)
            super.emit(eventName, ...args);
    }

    /*
     * Se agregan, es acumulativo, cantidad de notificaciones antes de 
     * emitir un evento. 
     * Se recomienda invocar antes de cualquier pieza de codigo 
     * asincronica que pueda llegar a llamar a emit().
     * 
     *
    add(n, eventName) {
        var n = parseInt(n) || -1; 
        if( n < 0 )
            throw new Error("Se esperaba un numero positivo que representa la cantidad de eventos que se agregan al MultiEvent");
        var curr = this.map.get(eventName);
        (curr < 0) ? curr = n : curr += n;
        this.map.set(eventName, curr);
    }

};
*/
/*
 * El evento DOMContentLoaded se da despues de cargar todo el HTML.
 * De lo contrario no va a poder encontrar los tag que necesita el script.
 */
document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll("input");

    // Se debe crear afuera, debe ser el mismo para todas las instancias
    //var multiEvent = new MultiEvent();
    
    // NO SE PUEDE USAR FOR
    //      Se pierderia el valor de la variable i del for al ocurrir el evento
    var i=0;
    inputs.forEach(function(input) {
        var widget = new ImgThermWidget({
            container: ".ti_" + ++i,
            value: input.value, 
            height: 400,
            /*imgPath: "../ImgThermWidget/termometro.png", */
            //multiEvent: multiEvent
        });
        input.addEventListener("keyup", function(event) {
            widget.setTemp(input.value);
        });
    });

});
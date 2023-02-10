import {ImgThermWidget} from './ImgThermWidget.mjs'
import {enableMoveAndResize} from './itw_sizeMove_jQuery.mjs'
import { MultiEvent } from './MultiEvent.mjs'

/*
 * El evento DOMContentLoaded se da despues de cargar todo el HTML.
 * De lo contrario no va a poder encontrar los tag que necesita el script.
 */
document.addEventListener("load", function() {
    const inputs = document.querySelectorAll("input");
    var multi = new MultiEvent();
    multi.on('itw_load', enableMoveAndResize);
    multi.wait(inputs.length, 'itw_load');
    // Se debe crear afuera, debe ser el mismo para todas las instancias
    //var multiEvent = new MultiEvent();
    
    // NO SE PUEDE USAR FOR
    //      Se pierderia el valor de la variable i del for al ocurrir el evento
    var i=0;
    inputs.forEach(function(input) {
        var widget;
        new ImgThermWidget({
            container: ".itw_" + ++i,
            initTemp: input.value, 
            height: 400
        }).then( function(w) {
            widget = w;
            multi.emit('itw_load');
        });

        input.addEventListener("keyup", function(event) {
            widget.setTemp(input.value);
        });
    });

});
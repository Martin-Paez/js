import {ImgThermWidget} from './ImgThermWidget.mjs'
import {enableMoveAndResize} from './itw_sizeMove_jQuery.mjs'

/*
 * El evento DOMContentLoaded se da despues de cargar todo el HTML.
 * De lo contrario no va a poder encontrar los tag que necesita el script.
 */
document.addEventListener("load", function() {

    const input = document.querySelector("input");
    
    var widget = new ImgThermWidget({
        initTemp: input.value,
        height: 200,
    })
    enableMoveAndResize();
    
    input.addEventListener("keyup", function(event) {
        widget.setTemp(input.value);
    });
    
});
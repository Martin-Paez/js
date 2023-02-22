import {ImgThermWidget} from './ImgThermWidget.mjs'
import {enableMoveAndResize} from './itw_sizeMove_jQuery.mjs'

/*
 * Uso load porque hay una imagen, de lo contrario la imagen puede no
 * llegar a cargar. Si no hubiera ningun elemento que genere el evento
 * load usaria DOMContentLoaded.
 */
document.addEventListener("load", function() {

    const input = document.querySelector("input");

    new ImgThermWidget({
        initTemp: input.value,
        height: 200,
    }).then( function(w) {
        enableMoveAndResize(true);
        input.addEventListener("keyup", function(event) {
            w.setTemp(input.value);
        });
    });
    
});

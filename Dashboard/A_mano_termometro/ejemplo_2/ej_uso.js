/*
 * El evento DOMContentLoaded se da despues de cargar todo el HTML.
 * De lo contrario no va a poder encontrar los tag que necesita el script.
 */
document.addEventListener("DOMContentLoaded", function() {

    const input = document.querySelector("input");

    var widget = new ImgThermWidget({ 
        value: input.value,
        height: 200,
        imgPath: "../ImgThermWidget/termometro.png",
        multiEvent: new ItwResizeAndMove()
    });
    
    input.addEventListener("keyup", function(event) {
        widget.setTemp(input.value);
    });

});
/*
 * Partiendo de un ImgThermometerWidget, se utiliza JQuery para
 * permitir redimensionarlo y desplazarlo con el mouse. 
 * 
 * Se setea el widget en position:absolute ya que de no hacerlo,
 * para los demas tags que forman parte del flow, seria como si
 * todavia estuviese en su posicion original. Luego, su tamano 
 * varia, probocando que los demas se muevan conforme a ello. Sin 
 * embargo, el usuario se confunde, porque el esta viendo el 
 * termometro en otro lugar de la pantalla . No queda claro como 
 * es que cambiando la dimension del widget las demas cosas se 
 * comienzan a mover de un modo antinatural.
 */
function enableMoveAndResize() {
    var widgets = document.querySelectorAll("._ti_widget");
    widgets.forEach(function(widget) {
        //widget.style.position = "absolute";
        $(widget).draggable();
        $(widget).width($(widget).find('._ti_img').width());
        $(widget).resizable({
            start: function(event, ui) {
                $(this).find('._ti_bar').hide();
                $(this).find('._ti_circle').hide();
            },
            stop: function(event, ui) {
                $(this).width($(widget).find('._ti_img').width());
                $(this).find('._ti_bar').show();
                $(this).find('._ti_circle').show();
            }
        });
    });
}
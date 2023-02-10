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
export function enableMoveAndResize(floating = true) {
    var widgets = document.querySelectorAll("._itw_widget");
    widgets.forEach(function(widget) {
        if ( floating ) {
            widget.style.position = 'absolute';
            widget.style.transform = 'translateX(-50%)';
        }
        $(widget).draggable();
        $(widget).width($(widget).find('._itw_img').width());
        $(widget).resizable({
            start: function(event, ui) {
                $(this).find('._itw_bar').hide();
                $(this).find('._itw_circle').hide();
            },
            stop: function(event, ui) {
                $(this).width($(widget).find('._itw_img').width());
                $(this).find('._itw_bar').show();
                $(this).find('._itw_circle').show();
            }
        });
    });
}
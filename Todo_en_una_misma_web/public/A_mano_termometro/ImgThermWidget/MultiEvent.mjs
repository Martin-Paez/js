/*
 * Emite un evento despues de haber sido notificado "n" veces para
 * un mismo topico.
 * 
 * Modo de uso:
 * 
 *      const multi = new MultiEvent();
 * 
 *      multi.on('eventName', () => {    // n = 0, Se emite a la 1er notificacion
 *          ...
 *      });
 * 
 *      multi.wait(2);               // n = 0, Se emitira a la 2da notificacion 
 * 
 *      multi.emit('eventName');    // --n = 1, No emite nada
 *      multi.emit('eventName');    // --n = 0, Emite un evento
 *      multi.emit('eventName');    // n = 0, Emite un evento
 * 
 * Es util cuando se trabaja con muchos eventos asincronicos y se 
 * necesita esperar a que todos ellos terminen.
 * 
 * Un caso, se da al cargar dinamicamente un nodo que contiene varios 
 * hijos. Entonces, por ejemplo, se espera el evento load para los hijos
 * multimedia individualmente (demoran mas en cargarse), y, uno mas,
 * para el contenedor.
 * 
 *      multi.add(2);       // Preferible agregarlos primero
 *      img.addEventListener("load", () => { multi.emit('load'); });
 *      container.addEventListener("load", () => { multiEvent.emit('load'); });
 * 
 */
export class MultiEvent {

    constructor() {
        this.map = new Map();
    }

    emit(event) {
        var e = this.map.get(event);
        if ( e === null ) 
            return;
        if (e.n > 0 ) {
            --e.n;
            this.map.set(event, e);
        }
        if (e.n === 0)
            e.callback.forEach(f => f());
    }

    on(event, callback) {
        var e = this.map.get(event) || { n: 0, callback: [] };
        e.callback.push(callback);
        this.map.set(event, e);
    }

    /*
     * Se agregan, es acumulativo, cantidad de notificaciones antes de 
     * emitir un evento. 
     * Se recomienda invocar antes de cualquier pieza de codigo 
     * asincronica que pueda llegar a llamar a emit().
     * 
     */
    wait(n, event) {
        var n = parseInt(n) || -1; 
        if( n < 0 )
            throw new Error("Se esperaba un numero positivo que representa la cantidad de eventos que se agregan al MultiEvent");
        var e = this.map.get(event) || { n:0 , callback: [] };
        e.n += n;
        this.map.set(event, e);
    }

};

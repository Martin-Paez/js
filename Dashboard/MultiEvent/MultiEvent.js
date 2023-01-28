const EventEmitter = require('events');
//import { EventEmitter } from 'events';

/*
 * Emite un evento despues de haber sido notificado "n" veces para
 * un mismo topico. Si No se usa el metodo add, no se emitiran eventos.
 * 
 * Modo de uso:
 * 
 *      const multi = new MultiEvent();
 * 
 *      multi.on('eventName', (...) => {    // NO se emitira nada, todavia
 *          ...
 *      });
 * 
 *      multi.add(2);               // Se emitira a la 2da notificacion 
 * 
 *      multi.emit('eventName');    // No emite nada
 *      multi.emit('eventName');    // Emite un evento
 *  
 * 
 * Es util cuando se trabaja con muchos eventos asincronicos y se 
 * necesita esperar a que todos ellos terminen.
 * 
 * Un caso, se da al cargar dinamicamente un nodo que contiene varios 
 * hijos. Entonces, por ejemplo, se espera el evento load para los hijos
 * multimedia, y, DOMNodeInserted, para el contenedor (no se sabe cual
 * se cargara ultimo):
 * 
 *      multi.add(2);       // Preferible agregarlos primero
 *      img.addEventListener("load", () => { multi.emit('load'); });
 *      document.addEventListener("DOMNodeInserted", () => { multi.emit('load'); });
 * 
 */
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
     */
    add(n, eventName) {
        var n = parseInt(n) || -1; 
        if( n < 0 )
            throw new Error("Se esperaba un numero positivo que representa la cantidad de eventos que se agregan al MultiEvent");
        var curr = this.map.get(eventName);
        (curr < 0) ? curr = n : curr += n;
        this.map.set(eventName, curr);
    }

};

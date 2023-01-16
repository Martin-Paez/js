/*
 * Llama al callback() y/o a eventMgr.notify() despues de haber sido
 * notificado "n" cantidad de veces.
 * 
 * Es util cuando se trabaja con muchos eventos asincronicos y se 
 * necesita esperar a que todos ellos terminen.
 * 
 * Se aumenta n usando el metodo add(). Se recomienda invocar primero
 * al metodo add(), antes de cualquier pieza de codigo asincronica
 * que pueda llegar a llamar a notify().
 * 
 * Un caso, se da al cargar dinamicamente un nodo que contiene varios 
 * hijos. Entonces, por ejemplo, se espera para los multimedia el 
 * evento load, y, DOMNodeInserted para el principal (no se sabe cual
 * se cargara ultimo).
 * Otro ejemplo, seria si se quieren cargar varios nodos diferentes, 
 * ya que se esperian varios DOMNodeInserted.
 * 
 */
class MultiEvent {

    constructor({callback=null, eventMgr=null}) {
        this.n = 0;
        this.callback = callback;
        this.eventMgr = eventMgr;
    }

    notify() {
        if ( this.n === 0 )
            return;
        this.n -= 1;
        if (this.n ===0) {
            if (this.callback !== null)
                this.callback();
            if (this.eventMgr !== null)
                this.eventMgr.notify();
        }    
    }

    add(n) {
        this.n += n;
    }

};
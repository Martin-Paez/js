/*
 * Se enumeran todos los elementos HTML que macheen la query. Luego
 * con el metodo get se obtienen de a uno, en menos de O(N). 
 * La numeracion se da en el orden en que document.querySelectorAll 
 * retorna los nodos.
 * Si se agregan nuevos nodos es necesario llamar al metodo update.
 */
export class IdToElem {
    constructor(query, id) {
        this.update(query, id)
    }

    update(query, id) {
        const elems = document.querySelectorAll(query);
        this.map = new Map();
        this.id = "data-" + id;
        alert(elems.length);
        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute(this.id, i+1);
            this.map.set(i+1, elems[i]);
        }
    }

    get(num) {
        return this.map.get(num);
    }
}

//module.exports = IdToElem;
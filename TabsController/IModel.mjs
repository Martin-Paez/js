export class IModel {
    constructor(model) 
    {
        if (new.target === IModel)
            throw new TypeError('IModel es abstracta, no se puede instanciar. ');

        this._model = model;
        this._on = {};
    }

    /**
     * Carga los datos en $pane
     *
     */
    load($pane, ...args) 
    {
        throw new TypeError('Metodo abstracto load() de IModel no implementado');
    }

    /**
     * Actualiza la informacion previamente cargada con load() en $pane
     *
     */
    reload($pane, ...args)
    {
        throw new TypeError('Metodo abstracto load() de IModel no implementado');
    }

    /**
     * Retorna un nombre que permite determinar el modelo de datos del que
     * proviene la informacion. 
     *
     */
    modelName()
    {
        throw new TypeError('Metodo abstracto load() de IModel no implementado');
    }

    /**
     * Evento que se emite al terminar con load() y reload()
     */
    on(event, callback, ...args) 
    {
        if(this._on[event] === undefined)
            this._on[event] = [];
        this._on[event].push({f: callback, args: [...args]});
    }
    
    off(event, callback)
    {
        let handlers = this._on[event] 

        if(handlers === undefined)
            return;

        let i=-1;
        while(++i < handlers.length && callback !== handlers[i]);
        if(i < handlers.length) 
            handlers.splice(i, 1);
    }

    _emit(event) 
    {
        (this._on[event] || []).forEach(handler => 
        {
            handler.f(...handler.args);
        });
    }

}

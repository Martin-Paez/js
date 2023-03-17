import { EventMgr } from './EventMgr.mjs';

export class IModel {
    constructor(model) 
    {
        if (new.target === IModel)
            throw new TypeError('IModel es abstracta, no se puede instanciar. ');

        this._model = model;
        this._eventMgr = new EventMgr();
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
    reload($pane, $btn, ...args)
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
        this._eventMgr.on(event, callback, ...args);
    }
    
    off(event, callback)
    {
        this._eventMgr.off(event, callback);
    }

    _emit(event) 
    {
        this._eventMgr.emit(event);
    }

}

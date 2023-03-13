import { IModel } from "./IModel.mjs";

export class IController extends IModel
{
    constructor(model, panesQ) 
    {
        if (new.target === IController)
            throw new TypeError('IController no se puede instanciar. ');

        super(model);
        this._loading = {};
        this._panes = {}; 
        $(panesQ).toArray().forEach((elem) => {
            if ( elem.id !== "" )
                this._panes[elem.id] = $(elem);
        });
    }

    /**
     * El controlador debe conocer los elementos html eh inicializar su
     * comportamiento.
     * 
     */
    _initElems(namespace) 
    {
        throw new TypeError('_initElems() de IController no implementado');
    }

    /**
     * Setea el handler al boton recibido para que invoque la Strategy 
     * this._load() con los parametros necesarios.
     * 
     * Esta pensado para agregar comportamiento a botones que no conoce
     * el controlador.
     * 
     * @param {jquery} $btn 
     */
    addOpenBtn($btn)
    {
        throw new TypeError('addBtn() de IController no implementado');
    }

    /**
     * Retorna un nombre que permite determinar el modelo de datos del que
     * proviene la informacion. 
     *
     */
    modelName()
    {
        this._model.modelName();
    }

    getModel(id)
    {
        return this._model[id];
    }

    getPane(id)
    {
        return this._panes[id];
    }

    removePane(id) 
    {
        delete this._$panes[id];
    }

    isLoading(id, val)
    {
        if(val === undefined)
            return this._loading[id];
        this._loading[id] = val;
    }

    /**
     * Carga los datos en $pane. Retorna una promesa.
     * 
     * Emite eventp onReady
     *
     */
    load($btn, id, ...args) 
    {
        if( this.isLoading(id) ) 
            throw new TypeError("Ya se ha solicitado la carga de los datos");

        let model = this.getModel(id);
        let $pane = this.getPane(id);

        if(model !== undefined) 
        {
            this.isLoading(id, true);
            model.on('loaded', () => 
            { 
                $btn.on('click', () => { this.reload(model, $pane, ...args); });
                this.isLoading(id, false);
            });   
            model.load($pane, ...args);
        } else
            if ( $pane.length === 0)
                throw new TypeError("Id no encontrado");
            else
                this.removePane(id);
    }

    /**
     * Actualiza la informacion previamente cargada con load() en $pane. Retorna
     * una promesa.
     *
     * Emite eventp onReady
     * 
     */
    reload(model, $pane, ...args)
    {
        model.reload($pane, ...args);
    }

    /**
     * Evento que se emite al terminar con load() y reload()
     */
    on(event, callback, ...args) 
    {
        for(var key in this._model)
            this.getModel(key).on(event, callback, ...args);
    }

    off(event, callback)
    {
        for(var key in this._model)
            this.getModel(key).off(event, callback);
    }

}
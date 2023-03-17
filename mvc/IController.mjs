import { IModel } from "./IModel.mjs";

export class IController extends IModel
{
    constructor(model, boxQ) 
    {
        super(model);

        this._loading = {};
        this._loaded  = {};
        this._box     = {}; 
        let $box      = $(boxQ);

        if($box.length === 1)
            this._setUpSingleModel($box[0]);
        else {
            $box.toArray().forEach((elem) => {
                if ( elem.id !== "" )
                    this._box[elem.id] = $(elem);
            });
            this._model = model;
        }
    }

    _setUpSingleModel(boxElem) 
    {
        let id;
        if(boxElem.id === "")
            id = `id-${now()}`;
        else if (this._model[boxElem.id] === undefined)
            id = boxElem.id;
        else
            return
        
        this._formatModel(id);
        this._box[id] = $(boxElem);
    }

    _formatModel(id)
    {
        let model = {};
        model[id] = this._model;
        this._model = model;
    }

    /**
     * El controlador debe conocer los elementos html eh inicializar su
     * comportamiento.
     * 
     */
    _initElems(namespace) 
    {
        
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
    addOpenBtn(id, $open, ...args)
    {
        $open = $($open);
        if(id === undefined)
            id = Object.keys(this._model)[0];
        $open.one('click', () => {this.load(id, $open, ...args)});
    }

    /**
     * Retorna un nombre que permite determinar el modelo de datos del que
     * proviene la informacion. 
     *
     */
    modelName(id)
    {
        this._model[id].modelName();
    }

    getModel(id)
    {
        return this._model[id];
    }

    getBox(id)
    {
        return this._box[id];
    }

    _removeEmptyBox(id) 
    {
        console.warn(`Se remueve el contendor ${id} porque no tiene un modelo.`);
        delete this._box[id];
    }

    isLoading(id, val)
    {
        if(val === undefined)
            return this._loading[id];
        this._loading[id] = val;
    }

    isNotLoaded(id, val)
    {
        if(val === undefined)
            return this._loaded[id] === undefined;
        this._loaded[id] = val;
    }

    /**
     * Carga un modelo dentro de su contenedor, ambos identificados por id. 
     * Si se provee, se vincula un boton al reload del modelo.
     * 
     * Si ya se solicito una carga que aun no se a completado lanza Excepcion.
     * Se puede usar forcedLoad() si se desea hacerlo adrede.
     * 
     * Si no se encontro un contenedor se lanza excepcion.
     * 
     * Si no hay modelo pero si contenedor, se emite un warning y se remueve el
     * contenedor (ver metodo _removeEmptyBox).
     * 
     * Es posible que el modelo emita un evento al cargarlo, dependiendo del
     * modelo que se halla provisto en el constructor.
     *
     */
    load(id, $btn = undefined, ...args) 
    {
        if( this.isLoading(id) ) 
            throw new TypeError("Reintenta antes de completar. Pruebe forcedLoad()");

        let model = this.getModel(id);
        let $box  = this.getBox(id);

        if($box.lenght === 0)
            throw new TypeError(`No hay un contenedor para el id ${id}`);

        if(model === undefined) 
            this._removeEmptyBox(id);
        else
            this._accomplishLoad(model, $box, $btn, id, ...args);
    }

    _accomplishLoad(model, $box, $btn, id, ...args)
    {
        if( this.isNotLoaded(id) )
        {
            this.isLoading(id, true);
            model.on('loaded', () =>
            {
                this._setUpReloadBtn(model, $box, $btn, ...args); 
                this.isLoading(id, false);
                this.isNotLoaded(id, false);
            });
            model.load($box, $btn, ...args);
        }
        else
            this._setUpReloadBtn(model, $box, $btn, ...args);
    }

    _setUpReloadBtn(model, $box, $btn, ...args)
    {
        if($btn === undefined || $btn.lenght == 0)
            return;

        $btn.off('click');
        $btn.on('click', () => { this.reload(model, $box, $btn, ...args); });
    }

    forcedLoad($btn, id, ...args)
    {
        this._isLoaded[id] = undefined;
        this._loading[id] = false;
        this.load($btn, id, ...args);
    }

    /**
     * Actualiza la informacion previamente cargada con load() en $box. Retorna
     * una promesa.
     *
     * Emite eventp onReady
     * 
     */
    reload(model, $box, $btn, ...args)
    {
        model.reload($box, $btn, ...args);
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
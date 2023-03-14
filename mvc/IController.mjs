import { IModel } from "./IModel.mjs";

export class IController extends IModel
{
    constructor(model, boxQ) 
    {
        super(model);

        this._loading = {};
        this._box     = {}; 
        let $box      = $(boxQ);

        if($box.length === 1)
            this._setUpSingleModel($box[0]);
        else {
            $box.toArray().forEach((elem) => {
                if ( elem.id !== "" )
                    this._box[elem.id] = $(elem);
            });
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
    addOpenBtn($open)
    {
        $open = $($open);
        $open.one('click', () => {this.load($open)});
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

    getBox(id)
    {
        return this._box[id];
    }

    removeBox(id) 
    {
        delete this._box[id];
    }

    isLoading(id, val)
    {
        if(val === undefined)
            return this._loading[id];
        this._loading[id] = val;
    }

    /**
     * Carga los datos en $box. Retorna una promesa.
     * 
     * Emite eventp onReady
     *
     */
    load($btn, id, ...args) 
    {
        if( this.isLoading(id) ) 
            throw new TypeError("Ya se ha solicitado la carga de los datos");

        let model = this.getModel(id);
        let $box = this.getBox(id);

        if(model !== undefined) 
        {
            this.isLoading(id, true);
            model.on('loaded', () => 
            { 
                $btn.off('click');
                $btn.on('click', () => { this.reload(model, $box, ...args); });
                this.isLoading(id, false);
            });   
            model.load($box, ...args);
        } else
            if ( $box.length === 0)
                throw new TypeError("Id no encontrado");
            else
                this.removeBox(id);
    }

    /**
     * Actualiza la informacion previamente cargada con load() en $box. Retorna
     * una promesa.
     *
     * Emite eventp onReady
     * 
     */
    reload(model, $box, ...args)
    {
        model.reload($box, ...args);
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
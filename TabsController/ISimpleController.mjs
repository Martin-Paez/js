import { IController } from "./IController.mjs";

export class ISimpleController extends IController 
{
    constructor(model, panesQ) 
    {
        if (new.target === ISimpleController)
            throw new TypeError('IController no se puede instanciar. ');

        super(model);
        this._loading = false;
        this._panes = $(panesQ);
    }

    getModel()
    {
        return this._model;
    }

    getPane()
    {
        return this._panes;
    }

    removePane()
    {
        if(model === undefined)
            throw new TypeError('Falta un modelo para el controlador.');
        throw new TypeError('Operacion removePane no soportada.');
    }

    isLoading(val)
    {
        if(val === undefined)
            return this._loading;
        this._loading = val;
    }
}
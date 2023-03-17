import { IController } from "./IController.mjs";

export class ISimpleController extends IController 
{
    constructor(model, boxQ) 
    {
        if (new.target === ISimpleController)
            throw new TypeError('IController no se puede instanciar. ');

        super(model, boxQ);
        this._loading = false;
        this._box = $(boxQ);
    }

    getModel()
    {
        return this._model;
    }

    getBox()
    {
        return this._box;
    }

    removeBox()
    {
        if(model === undefined)
            throw new TypeError('Falta un modelo para el controlador.');
        throw new TypeError('Operacion removeBox no soportada.');
    }

    isLoading(val)
    {
        if(val === undefined)
            return this._loading;
        this._loading = val;
    }
}
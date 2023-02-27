/**
 * Interfaz para modelos de datos de patrones, tales como, MVC y MVP.
 */
export class IModel {
    constructor(model) 
    {
        if (new.target === IModel)
            throw new TypeError('TabModel es abstracta, no se puede instanciar. ');

        this.model = model;
    }

    /**
     * Retorna los datos del modelo
     *
     */
    load(...args) 
    {
        throw new TypeError('Metodo abstracto load() de TabModel no implementado');
    }
}
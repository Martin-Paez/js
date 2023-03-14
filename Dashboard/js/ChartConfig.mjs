import { TabsController } from './TabsController.mjs';
import { IController } from './IController.mjs';

class Source {
    constructor(name)
    {

    }
    name() 
    {

    }
}

class SourceSelector extends IController
{
    constructor() 
    {
        super({});  
        let src = new Source('dht11');
        this._model[src.name] = src;
    }
    
    modelName()
    {
        return 'Seleccionar fuente';
    }

    load($window)
    {
        let $add = $($window.find('#acept-source-btn'));
        $add.on('click', () => {
            this._addSource();
        });
    }

}

export class ChartConfig extends IController
{
    constructor() 
    {
        super({});  
        
    }
    
    modelName()
    {
        return "Fuentes de datos";
    }

    load($window)
    {
        let $add = $($window.find('#add-source-btn'));
        $add.on('click', () => {
            this._createSource();
        });
    }

    reload()
    {

    }

    addChart(chart, id)
    {
        this._model[id] = {chart: chart, sources: []};
    }

    _createSource()
    {

    }

}
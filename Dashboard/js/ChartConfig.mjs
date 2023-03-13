import { TabsController } from './TabsController.mjs';
import { IController } from './IController.mjs';

export class ChartConfig extends IController
{
    constructor() 
    {
        super({});        
        
    }
    
    modelName()
    {

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
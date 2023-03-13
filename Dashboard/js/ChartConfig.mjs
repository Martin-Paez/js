import { TabsController } from './TabsController.mjs';
import { IController } from './IController.mjs';

export class ChartConfig extends IController
{
    constructor() 
    {
        super({});        
        this._$tabs = new TabsController();
    }

    onReady(callback) 
    {

    }
    
    
    modelName()
    {

    }

    load()
    {
        let $add = $(this._$window.find('#add-source-btn'));
        $add.on('click', () => {
            this._createSource();
        });
    }

    reload()
    {

    }

    addChart()
    {

    }

    _createSource()
    {

    }

}
import { TabWinController } from "./TabsWinController.mjs";
import {IModel} from "./IModel.mjs";

class TestModel extends IModel 
{
    constructor(model) 
    {
        super(model);
    }

    load(parentQ) 
    {
        $(parentQ).html(`Contenido del tab ${this.model}`);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let window = new TabWinController({ 
        uno: new TestModel(1), 
        dos: new TestModel(2) 
    });

    window.addOpenBtn('#open');
});
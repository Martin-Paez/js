import { WinController } from "./window.mjs";
import { TabsController } from "./TabsController.mjs";

export class TabWinController {
    constructor(models, namespace = "") 
    {
        let window = `.pop-window`;
        if (namespace !== "")
            window += '.' + namespace;
        let tabs = window + ` .nav-tabs`;
        let panes = window + ` .tab-content`;

        this._tabs   = new TabsController(tabs, panes, models);
        this._window = new WinController(namespace);

        this._openBtns = [];
    }

    addOpenBtn(btnQ) 
    {
        let $open = $(btnQ);

        this._window.addOpenBtn($open);
        if (this._tabs.isNotLoaded())
            $open.on('click', this.offLoadEvent.bind(this)); 

        this._openBtns.push($open);
    }

    offLoadEvent() 
    {
        this._tabs.load()
        this._openBtns.forEach(btn => {
            btn.off('click', this.offLoadEvent.bind(this));
        });
    }

}
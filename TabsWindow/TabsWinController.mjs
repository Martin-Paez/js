import { WinController } from "./window.mjs";
import { TabsController } from "./TabsController.mjs";

/**
 * Modelo para una ventana cuyo contenido son pestanas de bootstrap.
 * 
 * Clases HTML:
 * 
 *  .pop-window  :   ventana en si misma, contenedor de los elementos.
 * 
 *  Descendientes de .pop-window:
 *      .close-pop-window : Boton que cierra la ventana.
 *      .nav-tab          : Contenedor bootstrap de las pestanas.
 *      .tab-content      : Contenedor bootstrap del contenido de las pesanas.
 */
export class TabWinController {
    constructor(paneModels, namespace = "") 
    {
        if (namespace !== "")
            namespace += '.' + namespace;
        
        let window = `.pop-window${namespace}`;
        let close  = `${window} .close-pop-window${namespace}`;
        let panes  = window + ` .tab-content`;
        let tabs   = window + ` .nav-tabs`;

        this._window = new WinController(window, close);
        this._tabs   = new TabsController(tabs, panes, paneModels);

    }

    /**
     * Agrega los handlers a un boton que abre la ventana.
     * 
     * @param {query} btnQ
     *      Selector css del boton.
     */
    addOpenBtn(btnQ) 
    {
        this._window.addOpenBtn($(btnQ));
    }

}
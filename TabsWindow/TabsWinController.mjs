import { WebWindow  } from "./WebWindow.mjs";
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
 * 
 * @param {int} btnsPopWinWidth
 *  Ancho reservado para los botones de la ventana, tales como cerrar o mover.
 */
export class TabWinController 
{
    constructor(paneModels, windowId = "") 
    {
        this._window = new WebWindow(windowId);

        let windowQ = `#${windowId}.pop-window`;
        let panes   = windowQ + ` > .panes-ww`;
        let tabs    = windowQ + ` .tabs-ww`;
        
        this._tabs   = new TabsController(tabs, panes, paneModels);

        this._tabs.onClick(( model) => {
            this._window.title(model.catalogName());
        });
        this._tabs.loadActive();

        this._setUpTabsResponsive(windowQ);
    }

    hide() {
        this._window.hide();
    }

    show() {
        this._window.show();
    }

    isOpen() {
        return this._window.isOpen();
    }

        
    // todo , namespace con $window a todo
    _setUpTabsResponsive(windowQ) 
    {
        this._$window    = $(windowQ);
        this._$head      = this._$window.find('.head-pop-window');
        let $btns        = this._$head.find('.btns-pop-window');
        this._closeWidth = $btns.find('.close-pop-window').outerWidth();
        this._$empty     = $btns.find('.empty-head-pop-window');
        this._$title     = $btns.find('.title-pop-window');
        this._$tabs      = this._$window.find('.tabs-ww');

        this._calcTabsLimit();
        if( this._$tabs.length > 0)
            this._currLimit = 0;
        else
            this._currLimit = this._responsiveLimit;
        this._checkTabsResponsive();

        $(window).on( "resize", (e) => {
            if(e.target === window)
                setTimeout( () => 
                {
                    this._calcTabsLimit();
                    this._checkTabsResponsive();
                }
                , 500);        
            else if(e.target == this._$window[0])    
                this._checkTabsResponsive();
        });

        this._$window.on('left-pop-window top-pop-window right-pop-window', (e) => 
        {
            this._calcTabsLimit(); // Con tamano fijo, en resize no puede calcular
            this._checkTabsResponsive();
        });
    }

    _calcTabsLimit() 
    {
        this._responsiveLimit = 0;
        this._$tabs.each( (i, link) => 
        {
            this._responsiveLimit += $(link).outerWidth();
        });
        let empty = this._$empty.outerWidth();
        let title = this._$title.outerWidth();
        this._responsiveLimit += this._closeWidth + title - empty;
        this._responsiveLimit /= $(window).width();
    }

    _checkTabsResponsive()
    { 
        let winWidth = $(window).width();
        let emptyWidth = this._$empty.outerWidth();
        emptyWidth /= winWidth; 
            
       // $('textarea').html(`window: ${winWidth}px\nempty: ${parseInt(emptyWidth*100)}%\nlimit: ${parseInt(this._currLimit*100)}%`);
        if (emptyWidth > this._currLimit) 
        {
            
            this._$tabs.prependTo(this._$head);
            this._currLimit = 0;
        } 
        else
        {    
            this._currLimit = this._responsiveLimit;

            let first = this._$window.children().eq(0); 
            this._$tabs.insertAfter(first);
        }
        //$('textarea').html(`${$('textarea').html()}\nnew limit: ${parseInt(this._currLimit*100)}%`);
    }

    /**
     * Agrega los handlers a un boton que abre la ventana.
     * 
     * @param {query} btnQ
     *      Selector css del boton.
     */
    addOpenBtn(btnQ) 
    {
        let $btn = $(btnQ);
        this._window.addOpenWidget($btn);
    }

}

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
    constructor(paneModels, windowQ = "") 
    {
        windowQ      = `${windowQ}.pop-window`;
        let panes    = windowQ + ` > .window-content`;
        let tabsQ    = windowQ + ` .tabs-ww`;
        let tabs     = new TabsController(tabsQ, panes, paneModels);
        this._window = new WebWindow(windowQ, tabs);

        tabs.on('loaded ', () => {
            this._window.title(tabs.modelName());
        });

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

    _loadElems(windowQ) {
        this._$window    = $(windowQ);
        this._$head      = this._$window.find('.head-pop-window');
        let $btns        = this._$head.find('.btns-pop-window');
        this._closeWidth = $btns.find('.close-pop-window').outerWidth();
        this._$empty     = $btns.find('.empty-head-pop-window');
        this._$title     = $btns.find('.title-pop-window');
        this._$tabs      = this._$window.find('.tabs-ww');
    }
    
    _initResponsiveLimit() 
    {
        this._responsiveLimit = 0;
        this._$tabs.find('.nav-link').each( (i, link) => 
        {   
            this._responsiveLimit += $(link).outerWidth();
        });
        this._$window.find('.btns-pop-window > a').each( (i, btn) => 
        {   
            this._responsiveLimit += $(btn).outerWidth();
        });
        let $title   = this._$window.find('.title-label-pop-window');
        this._responsiveLimit +=  $title.outerWidth();
        var remUnits = parseFloat($("html").css("font-size"));
        this._responsiveLimit /= remUnits;
        
        let width = this._$window.outerWidth() / remUnits; 
        this._inlineTabs = width <= this._responsiveLimit;
             
        this._checkTabsResponsive(); //init this._inlineTabs
    }

    _initOnWindowResize()
    {
        let ignored = 0;
        $(window).on( "resize", (e) => {
            if(e.target === window)
            {   
                ignored++;
                setTimeout( () => 
                {
                    if ( --ignored === 0 )
                        this._checkTabsResponsive();
                }
                , 100);
            }           
            else if(e.target == this._$window[0])    
                this._checkTabsResponsive();
        });
    }

    // todo , namespace con $window a todo
    _setUpTabsResponsive(windowQ) 
    {
        this._loadElems(windowQ);
        this._initResponsiveLimit();
        this._initOnWindowResize();        

        this._$window.on('left-pop-window top-pop-window right-pop-window maxmin-pop-window', (e) => 
        {
            this._checkTabsResponsive();
        });
    }

    _checkTabsResponsive()
    { 
        var remUnits = parseFloat($("html").css("font-size"));
        let width = this._$window.outerWidth() / remUnits; 
            
        // $('textarea').html(`window: ${winWidth}px\nempty: ${parseInt(emptyWidth*100)}%\nlimit: ${parseInt(this._currLimit*100)}%`);
        if (! this._inlineTabs && width > this._responsiveLimit) 
        {
            this._$tabs.prependTo(this._$head);
            this._inlineTabs = true;
        } 
        else if (this._inlineTabs && width <= this._responsiveLimit)
        {    
            let first = this._$window.children().eq(0); 
            this._$tabs.insertAfter(first);
            this._inlineTabs = false;
        }
        //$('textarea').html(`${$('textarea').html()}\nnew limit: ${parseInt(this._currLimit*100)}%`);
    }

    /**
     * Agrega los handlers a un boton que abre la ventana.
     * 
     * @param {query} btnQ
     *      Selector css del boton.
     */
    addOpenWidget(btnQ) 
    {
        let $btn = $(btnQ);
        this._window.addOpenWidget($btn);
    }

}

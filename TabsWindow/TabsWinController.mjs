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
 * 
 * @param {int} btnsPopWinWidth
 *  Ancho reservado para los botones de la ventana, tales como cerrar o mover.
 */
export class TabWinController 
{
    constructor(paneModels, namespace = "", btnsPopWinWidth = 60) 
    {
        if (namespace !== "")
            namespace += '.' + namespace;
        
        let windowQ = `.pop-window${namespace}`;
        let close   = `${windowQ} .close-pop-window`;
        let move    = `${windowQ} .move-pop-window`;
        let panes   = windowQ + ` > .tab-content`;
        let tabs    = windowQ + `.title-pop-window .nav-tabs`;
        
        this._window = new WinController(windowQ, close, move);
        this._tabs   = new TabsController(tabs, panes, paneModels);
    
        this._setUpTabsResponsive($(windowQ));
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
    _setUpTabsResponsive($window) 
    {
        if( $window.find('.title-pop-window .nav-tabs').length > 0)
            this._currLimit = 0;
        else
            this._currLimit = this._responsiveLimit;

        this._checkTabsResponsive($window) 
        $(window).on( "resize", f.bind(this, $window));

        $window.on('left-pop-window top-pop-window right-pop-window', (e) => 
        {
            this._checkTabsResponsive($window);
        });
    }

    async _checkTabsResponsive($window)
    { 
        this._responsiveLimit = 0;
        $window.find('.title-pop-window .nav-link').each( (i, link) => 
        {
            this._responsiveLimit += $(link).outerWidth();
        });
        let $title = $window.find('.title-pop-window');
        let $btns = $title.find('.btns-pop-window');
        let $empty = $btns.find('.empty-title-pop-window');

        this._responsiveLimit += $btns.outerWidth() - $empty.outerWidth();
        this._responsiveLimit /= $(window).width();
        let winWidth = $(window).width();
        let emptyWidth = $empty.outerWidth();
        emptyWidth /= winWidth; 
            
       // $('textarea').html(`window: ${winWidth}px\nempty: ${parseInt(emptyWidth*100)}%\nlimit: ${parseInt(this._currLimit*100)}%`);
        if (emptyWidth > this._currLimit) 
        {
            
            $title.find('.nav-tabs').prependTo($title);
            this._currLimit = 0;
        } 
        else
        {    
            this._currLimit = this._responsiveLimit;

            let first = $window.children().eq(0); 
            $title.find('.nav-tabs').insertAfter(first);
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
        $(btnQ).on('click', () => 
        {
            setTimeout( () => { this._tabs.reload(); }, 1100);
        });
    }

}

async function f($window) {
    await new Promise( (resolve) => {
        this._checkTabsResponsive($window);
        resolve();
    });
} 
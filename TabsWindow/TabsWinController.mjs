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
        let panes   = windowQ + ` .tab-content`;
        let tabs    = windowQ + ` .nav-tabs`;
        
        this._window = new WinController(windowQ, close, move);
        this._tabs   = new TabsController(tabs, panes, paneModels);

        this._setUpTabsResponsive($(windowQ));
    }

    // todo , namespace con $window a todo
    _setUpTabsResponsive($window) 
    {
        let title = $window.find('.move-pop-window .title-txt-pop-window').width();
        let move  = $window.find('.move-pop-window .bi-arrows-move').width(); 
        let close = $window.find('.close-pop-window').width(); 
        let extraWidth = title + move + close;

        this._responsiveLimit = 0;
        $window.find('.nav-link').each( (i, link) => 
        {
            this._responsiveLimit += $(link).outerWidth();
        });

        let $title = $window.find('.title-pop-window');
        if($title.find('.nav-tabs').length > 0)
            this._currLimit = 0;
        else
            this._currLimit = this._responsiveLimit;


        this._checkTabsResponsive($window, extraWidth) 
        $(window).on( "resize", () => 
        { 
            this._checkTabsResponsive($window, extraWidth) 
        });

        // Por si .empty-title-pop-window no es 0 al instanciar la clase
        if( $window.find('.title-pop-window .nav-tabs').length === 0) 
            $window.css('width', $window.width() + 1);

        $window.on('left-pop-window top-pop-window right-pop-window', (e) => 
        {
            this._checkTabsResponsive($window, extraWidth);
        });
    }

    _checkTabsResponsive($window, extraWidth)
    {   
        let winWidth = $(window).width();
        let $empty = $window.find('.empty-title-pop-window');
        let emptyWidth = $empty.width();
        emptyWidth /= winWidth; 

        if (emptyWidth > this._currLimit) 
        {
            let $title = $window.find('.title-pop-window');
            $window.find('.nav-tabs').prependTo($title);
            this._currLimit = 0;
        } 
        else
        {
            this._currLimit = this._responsiveLimit;
            let first = $window.children().eq(0); 
            $window.find('.nav-tabs').insertAfter(first);
        }
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
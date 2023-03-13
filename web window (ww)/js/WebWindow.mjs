import { animate, getCssVar, cssSecondsToMillis }   from './cssAnimate.mjs';
import { initPopUp, setPopUpEvent } from './popUpAnimation.mjs';
import { ISimpleController } from './ISimpleController.mjs';
import { printf } from './dashboard.js';

class WindowState {
    constructor(btn, left, top, width, height) 
    {
        this.btn    = btn;
        this.left   = left;
        this.top    = top;
        this.width  = width;
        this.height = height;
    }
}

export class WebWindow extends ISimpleController
{
    constructor(windowQ, model)
    {
        super(model, windowQ);
        this._$closeBtn = this._box.find('.close-pop-window');
        this._$move     = this._box.find('.move-pop-window');
        this._history   = [];

        this.title(this._model.modelName());

        this._initResizable();
        this.enableDrag();
        this._setUpResponsive(this._box);
        this._setUpMaxWindow();

        if(this._box.hasClass('open'))
            this._model.load();
    }

    modelName() 
    {
        return this._model.modelName();
    }

    isOpen()
    {
        return this._box.hasClass('open');
    }
    
    title(title)
    {
        let $title = this._box.find('.title-label-pop-window');
        
        if (title === null)
            return $title.html();
        $title.html(title);
    }


    /**** Botones con animacion que abren y cierran la ventana  ****/
    

    // No es necesario remover el boton si el tag es eliminado
    // SetUp un boton para abrir la ventana
    addOpenBtn(openBtnQ)
    {
        let $open = $(openBtnQ);
        setPopUpEvent($open, this._box, 'opening', false);
        $open.one('click', () => {this.load($open)});
    }

    setDefaultCloseBtn()
    {
        setPopUpEvent(this._$closeBtn, this._box, 'closing');
    }

    // Idem addOpenBtn, pero desaparece el boton y reaparece al cerrar la ventana
    addOpenToggleBtn($open, openBtnContainerQ)
    {
        $open = $($open);
        let $widget = $(openBtnContainerQ);
        initPopUp($open, this._$closeBtn, this._box);
        initPopUp(this._$closeBtn, $open, $widget, 'leaving', 'coming');
        $open.one('click', () => {this.load($open)});
    }

    // Idem addOpenToggleBtn, y ademas, setea drag al wiget que contiene al boton
    addOpenWidget(widgetQ)
    {
        let $widget = $(widgetQ);
        let $open = $widget.find('#open');
        let $move = $widget.find('.move-open-widget');
        this._setUpResponsive($widget);
        this.addOpenToggleBtn($open, $widget);
        $move.one('mousedown', (e) =>
        {
            $widget.draggable({
                stop:  (e) => { this._posToPercentage($widget); }
            });
        });
    }


    /**********  Abrir y cerrar la ventana Sin animacion *****************/


    hide()
    {
        if (! this.isOpen())
            return;
        
        this._box.removeClass('open');
        let seconds = getCssVar('--anim-duration');
        animate(this._box, 'closing', cssSecondsToMillis(seconds));
    }
    
    show()
    {
        if (this.isOpen())
            return;

        this._box.addClass('open');
        let seconds = getCssVar('--anim-duration');
        animate(this._box, 'opening', cssSecondsToMillis(seconds));
    }


/************* Historial de estados de la ventana *****************/

    _saveState(btn) 
    {
        // Se harcodean por jquery resizable (no sirven las clases css)
        let $window  = $(window);
        let position = this._box.position();
        let top      = position.top;  
        let left     = position.left;
        let width    = this._box.width();
        let height   = this._box.height();  
        
        top    = `${position.top           / $window.height() * 100 }%`;  
        left   = `${position.left          / $window.width()  * 100 }%`;
        width  = `${this._box.width()  / $window.width()  * 100 }%`;
        height = `${this._box.height() / $window.height() * 100 }%`;  
        
        this._history.push(new WindowState(btn, left, top, width, height));
    }

    _loadState(btn) 
    {
        if ( this._history.length == 0 )
            return console.warn("La ventana no tiene mas estados que cargar");

        let h = this._history[this._history.length-1];
        if(h.btn === btn)
        {
            this._resizeAndMove(h.left, h.top, h.width, h.height);
            this._history.pop();
        } 
        else
        {
            let i = this._history.length - 1; // --i = ante-ultimo
            while(--i > -1 && this._history[i].btn !== btn) ;
            if( i > -1)
            {
                this._history[i].btn = this._history[i+1].btn;
                this._history.splice(i+1, 1);           
            }
            else
                console.error(`No se encontro ${btn} en el historial de estados`);
        }
    }


    /****************** Redimenzionar la ventana **********************/


    _resizeAndMove(left, top, width, height)
    {
        this._move(left, top);
        this._resize(width, height);
    }

    _move(left, top) 
    {
        this._box.css('left',left);
        this._box.css('top',top);
    }

    _resize(width, height)
    {
        this._box.css('width',width);
        this._box.css('height',height);
    }

    _initResizable()
    {
        this._box.resizable({
            handles: "all",
            stop: (e) =>
            {
                this.exitMaximize();

                let $target = $(e.target);
                let max     = $(window).width();
                let width   = $target.outerWidth();

                if(width > max)
                    width   = 100;
                else 
                    width = $target.width() / max * 100;
                $target.css('width', `${width}%`);
                
                this._initAutoBtn();
                this._bringBackOnY(this._box, this._box.position());
            }
        });
    }


    /************* Opcion de ajuste automatico de altura ****************/


    _initAutoBtn() 
    {
        let pinBtn = this._box.find('.auto-pop-window');
        pinBtn.removeClass('hide');
        pinBtn.on('click', () => {
            pinBtn.addClass('hide');
            // Np se usa clases por jquery resizable
            this._box.css('height', 'auto'); 
        });
    }

    _resetAutoBtn() 
    {
        let pinBtn = this._box.find('.auto-pop-window');
        pinBtn.trigger('click');
    }


    /************* Mover y Estado de ventana anclada *****************/


    initPinPreview()
    {
        this._previewPinnedSide = undefined;
    }

    showPinPreview(sideClass)
    {
        this._box.removeClass(this._previewPinnedSide);
        this._box.removeClass(this._pinnedSide);
        this._box.addClass(sideClass);
        this._previewPinnedSide = sideClass;
    }

    isPinned()
    {
        return this._pinnedSide !== undefined;
    }

    isPinnedChanged()
    {
        return this._pinnedSide !== this._previewPinnedSide;
    }

    isPreviewOn(sideClass)
    {
        return this._previewPinnedSide === sideClass;
    }

    unPin()
    {
        this._box.removeClass(this._pinnedSide);
        this._pinnedSide = undefined;
    }

    hidePinPreview()
    {
        if (this._previewPinnedSide === undefined)
        {
            console.warn("La vista previa la ventana fija ya esta oculta.");
            return;
        }
        this.showPinPreview(this._pinnedSide || "");
    }

    isDraggable() {
        return this._dragEnabled;
    }

    disableDrag() {
        this._dragEnabled = false;
        this._$move.off('mousedown');
    }

    // $target solo tiene drag presionando $btn y drop dentro de window 
    enableDrag() 
    {
        this._initDragYHandlers();
        this._$move.one('mousedown', (e) =>
        {
            let drag;
            this._box.draggable({
                start: (e) => 
                { 
                    drag = this._onDragStart(e);
                },
                drag: (e, ui) => { drag(e, ui) }, // No se puede dar drag directamente
                stop:  (e) =>
                {
                    this._onDragStop(e);
                }
            });
        });
        this._dragEnabled = true;
    }

    _initDragYHandlers() {
        this._onWindowOut = (e) =>
        {
            let err = -2;
            if (e.pageY <= err && ! this.isPreviewOn("top-pop-window")) 
            {
                this.showPinPreview('top-pop-window');
                this._box.toggleClass('fix-preview');
            }
        };

        this._onWindowEnter = (e) =>
        {
            let err = -2;
            if (e.pageY >= err && this.isPreviewOn("top-pop-window")) 
            {
                this.hidePinPreview();
                this._box.toggleClass('fix-preview');
            }
        };
    }

    _onDragStart(e)
    {
        this.initPinPreview();

        $('body').on("mouseleave", this._onWindowOut);
        $('body').on("mouseenter", this._onWindowEnter);

        let onDrag;
        let wasMaximized = this.exitMaximize();
        if ( wasMaximized ) // Antes de guardar el estado
            onDrag = (e, ui) => { 
                ui.position.top = e.pageY ;
                ui.position.left = e.pageX - this._box.outerWidth() / 2;
                this._onDrag(e);
            };
        else
            onDrag = (e) => { this._onDrag(e); };

        this._saveState('pin');
        if (wasMaximized)
            this._move(e.pageX, e.pageY); 

        return onDrag;
    }

    _onDrag(e)
    {
        let err = 3;
        let max   = $(window).width() - err;
        let yOk   = e.pageY > 0;
        let prevL = this.isPreviewOn("left-pop-window");
        let prevR = this.isPreviewOn("right-pop-window");

        if (e.pageX <= err && ! prevL && yOk)
        {
            this.showPinPreview('left-pop-window');
            this._box.addClass('fix-preview');
        }
        if (e.pageX > max && ! prevR && yOk)
        {
            this.showPinPreview('right-pop-window');
            this._box.addClass('fix-preview');
        }
        else if (e.pageX > err && prevL ||
                 e.pageX < max && prevR )
        {
            this.hidePinPreview();
            this._box.removeClass('fix-preview');
        }
    }

    _onDragStop(e)
    {
        $('body').off("mouseleave", this._onWindowOut);
        $('body').off("mouseenter", this._onWindowEnter);

        this._posToPercentage(this._box);

        if (this.isPinnedChanged())
        {
            this._checkPinedWindow(e.pageX, e.pageY);
            this._box.removeClass('fix-preview');
        }
        else
            this._bringBack(this._box);

        this._box.draggable('destroy');
        this.enableDrag();
    }

    _posToPercentage($target) 
    {
        let max = $(window).width();
        let val = $target.position().left / max * 100;
        $target.css('left', `${val}%`);

        max = $(window).height();
        val = $target.position().top / max * 100;
        $target.css('top', `${val}%`);
    }

    _checkPinedWindow(mouseX, mouseY)
    {
        var err = 4;

        if (mouseX < err)   
            this.pinWindow('left-pop-window');
        else if(mouseX > $(window).width() - err)
            this.pinWindow('right-pop-window');
        else if (mouseY < err)
            this.pinWindow('top-pop-window');
        else
            this._bringBack(this._box);
    }

    pinWindow(sideClass)
    {
        let width  = getCssVar('--min-width-pop-window');
        this._box.css('width', width);
        this._box.css('height', 'auto');

        let $icon = this._box.find('.pin-pop-window');
        $icon.removeClass('hide');
        this._resetAutoBtn();

        $icon.one('mousedown', () =>
        {
            $icon.addClass('hide');
            this.unPin();
            this._loadState('pin');
            this._initAutoBtn();
            this._bringBack(this._box);
            this._box.trigger(sideClass);
            if( ! this.isDraggable())
                this.enableDrag();
        });

        this._pinnedSide = sideClass;
        this._box.trigger(sideClass);
    }


    /*** Evitar que la ventana escape de la ventana del navegador ***/


    _setUpResponsive($target)
    {
        $(window).on('resize', (e) =>
        {
            if (e.target === window)
            {
                setTimeout(() =>
                {
                    this._bringBack($target);
                }, 500);
            }
        });
    }

    // Trae devuelta $moved si se fue de la pantalla para top, left o right
    _bringBack($moved)
    {
        if ( ! $moved.hasClass('open') && $moved.hasClass('closeByDefault') )
            return console.warn("Se esta moviendo un elemento oculto");

        let pos = $moved.position();
        this._bringBackOnX($moved, pos);
        this._bringBackOnY($moved, pos);
    }

    _bringBackOnX($moved, pos)
    {
        if (pos.left < 0)
            $moved.css('left', '0');
        else
        {
            let width = $moved.outerWidth();
            let max = $(window).width();

            if (pos.left + width > max)
                $moved.css('left', `${(max - width) / max * 100}%`);
            
        }
    }

    _bringBackOnY($moved, pos)
    {
        if (pos.top < 0)
            $moved.css('top', '0');
        else
        {
            let height = $moved.outerHeight();
            let max = $(window).height();

            if (pos.top + height > max)
                if(height > max)
                    this._box.css('height', max - pos.top); 
                else
                    $moved.css('top', `${(max - height) / max * 100}%`);
        }
    }
    

    /******************* Estado maximiazada *****************************/


    _setUpMaxWindow() 
    {
        let $max = this._box.find('.maxmin-pop-window');
        $max.one('click', () => 
        {
            if( this.isPinned() ) 
                this.disableDrag();
            this._saveState('max');
            this._resizeAndMove('0%', '0%', '100%', '100%');
            this._toggleMaxMin($max);
            $max.one('click', () => 
            {
                this._loadState('max');
                this._toggleMaxMin($max);
                this._setUpMaxWindow();
                if( ! this.isDraggable() )
                    this.enableDrag();
            });
        });
    }

    _toggleMaxMin($max)
    {   
        $max.find('.max-pop-window').toggleClass('hide');
        $max.find('.min-pop-window').toggleClass('hide');
        this._box.toggleClass('maximized-pop-window');
        this._box.trigger('maxmin-pop-window');
        this._bringBack(this._box);
    }

    exitMaximize() 
    {
        if(this._box.hasClass('maximized-pop-window')) 
        {
            let $max = this._box.find('.maxmin-pop-window'); 
            $max.off('click');
            this._loadState('max');
            this._toggleMaxMin($max);
            this._setUpMaxWindow();
            return true;
        }
        return false;
    }


}
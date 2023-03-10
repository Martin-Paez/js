import { initPopUp, setPopUpEvent } from './popUpAnimation.mjs';
import { getCssVar } from '../Utils/cssAnimate.mjs';

export class WebWindow
{
    constructor(windowId)
    {
        this._$window = $(`#${windowId}`);
        this._$closeBtn = this._$window.find('.close-pop-window');
        let $move = this._$window.find('.move-pop-window');

        this._initResizable();
        this._LimitedDrag($move, this._$window);
        this._setUpResponsive(this._$window);
    }

    title(title)
    {
        let $title = this._$window.find('.title-label-pop-window');
        if (title === null)
            return $title.html();
        $title.html(title);
    }

    _initResizable()
    {
        this._$window.resizable({
            handles: "all",
            stop: (e) =>
            {
                let $target = $(e.target);
                let width = $target.width() / $(window).width() * 100;

                $target.css('width', `${width}%`);
            }
        });
    }

    initPinPreview()
    {
        this._previewPinnedSide = undefined;
    }

    showPinPreview(sideClass)
    {
        this._$window.removeClass(this._previewPinnedSide);
        this._$window.addClass(sideClass);
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
        this._$window.removeClass(this._pinnedSide);
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

    // $target solo tiene drag presionando $btn y drop dentro de window 
    _LimitedDrag($btn, $target) 
    {
        let onWindowOut = (e) =>
        {
            let err = -2;
            if (e.pageY <= err) 
            {
                this.showPinPreview('top-pop-window');
                this._$window.css('opacity', '40%');
            }
        };

        let onWindowEnter = (e) =>
        {
            let err = -2;
            if (e.pageY >= err && this.isPreviewOn("top-pop-window")) 
            {
                this.hidePinPreview();
                this._$window.css('opacity', e.data.opacity);
            }
        };

        $btn.one('mousedown', (e) =>
        {
            let opacity = this._$window.css('opacity');
            $target.draggable({
                start: (e, opacity) => 
                { 
                    this.onDragStart(e, opacity, onWindowOut, onWindowEnter) 
                },
                drag:  (e) => { this.onDrag(e, opacity) },
                stop:  (e) =>
                {
                    this.onDragStop(e, opacity, onWindowOut, onWindowEnter, $btn, $target);
                }
            });
        });
    }

    onDragStart(e, opacity, onWindowOut, onWindowEnter)
    {
        $('body').on("mouseleave", onWindowOut);
        $('body').on("mouseenter", {opacity}, onWindowEnter);
        if (!this.isPinned())
        {
            this._prevDragWidth  = this._$window.outerWidth();
            this._prevDragHeight = this._$window.outerHeight();
            this._prevDragPos    = this._$window.offset();
        }
    }

    onDrag(e, opacity)
    {
        let err = 2;

        if (e.pageX <= err)
        {
            this.showPinPreview('left-pop-window');
            this._$window.css('opacity', '40%');
        }
        else if (e.pageX > err && this.isPreviewOn("left-pop-window"))
        {
            this.hidePinPreview();
            this._$window.css('opacity', opacity);
        }
    }

    onDragStop(e, onWindowOut, onWindowEnter, $btn, $target)
    {
        $('body').off("mouseleave", onWindowOut);
        $('body').off("mouseenter", onWindowEnter);

        this._pxToPercent($target);

        if (this.isPinnedChanged())
            this._checkPinedWindow(e.pageX, e.pageY, $btn);
        else
            this._bringBack($target);

        $target.draggable('destroy');
        this._LimitedDrag($btn, $target);
    }

    _pxToPercent($target)
    {
        let max = $(window).width();
        let left = $target.position().left / max * 100;

        $target.css('left', `${left}%`);
    }

    _checkPinedWindow(mouseX, mouseY, $btn)
    {
        var err = 2;

        if (mouseX < err)
            this.pinWindow('left-pop-window', $btn);
        else if (mouseY < err)
            this.pinWindow('top-pop-window', $btn);
        else
            this._bringBack(this._$window);
    }

    pinWindow(menuClass)
    {
        let width  = getCssVar('--min-width-pop-window');
        this._$window.css('width', width);
        this._$window.css('height', 'auto');

        let $icon = this._$window.find('.move-pop-window i');
        $icon.addClass('bi-pin-angle');

        $icon.on('mousedown', () =>
        {
            $icon.removeClass('bi-pin-angle');
            this.unPin();
            this._$window.css('width', this._prevDragWidth);
            this._$window.css('height', this._prevDragHeight);
            this._$window.offset(this._prevDragPos);
            this._$window.trigger(menuClass);
            this._bringBack(this._$window);
        });

        this._pinnedSide = menuClass;
        this._$window.trigger(menuClass);
    }

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

    _bringBackOnY($moved, pos)
    {
        if (pos.top < 0)
            $moved.css('top', '0');
        else
        {
            let height = $moved.outerHeight();
            let max = $(window).height();

            if (pos.top + height > max)
                $moved.css('top', `${(max - height) / max * 100}%`);
        }
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

    // SetUp un boton para abrir la ventana
    addOpenBtn(openBtnQ)
    {
        let $open = $(openBtnQ);
        setPopUpEvent(0.9, $open, this._$window, 'opening', false);
    }

    setDefaultCloseBtn()
    {
        setPopUpEvent(0.9, this._$closeBtn, this._$window, 'closing');
    }

    // Idem addOpenBtn, pero desaparece el boton y reaparece al cerrar la ventana
    addOpenToggleBtn($open, openBtnContainerQ)
    {
        $open = $($open);
        let $widget = $(openBtnContainerQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window);
        initPopUp(1, this._$closeBtn, $open, $widget, 'leaving', 'coming');
    }

    // Idem addOpenToggleBtn, y ademas, setea drag al wiget que contiene al boton
    addOpenWidget(widgetQ)
    {
        let $widget = $(widgetQ);
        let $open = $widget.find('#open');
        let $move = $widget.find('.move-open-widget');
        this._setUpResponsive($widget);
        this.addOpenToggleBtn($open, $widget);
        this._LimitedDrag($move, $widget);
    }

    isOpen()
    {
        return this._$window.hasClass('open');
    }

    hide()
    {
        if (this.isOpen())
            this._$window.removeClass('open');
    }

    show()
    {
        if (!this.isOpen())
            this._$window.addClass('open');
    }

    toggle()
    {
        this._$window.toggleClass('open');
    }
}
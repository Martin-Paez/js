export class WinController 
{
    constructor(windowQ, closeBtnQ, moveBtnQ, timer=1000) 
    {
        this._$window   = $(windowQ);
        this._$closeBtn = $(closeBtnQ);

        this._initResizable();
        this._LimitedDrag($(moveBtnQ), this._$window);
        this._setUpResponsive(this._$window);
    }

    _initResizable() {
        this._$window.resizable({
            handles: "all",
            stop: (e) => {
                let $target = $(e.target);
                let width   = $target.width()  / $(window).width()  * 100;
                let height  = $target.height() / $(window).height() * 100;
                
                $target.css('width', `${width}%`);
                $target.css('height', `${height}%`);
            }
        });
    }

    // $target solo tiene drag presionando $btn y drop dentro de window 
    _LimitedDrag($btn, $target) 
    {
        $btn.one('mousedown', (e) => 
        {
            $target.draggable({
                start: (e, ui) => {
                    
                    $('textarea').html(`${$('textarea').html()}\nhola`);

                },
                stop: (e) => 
                { 
                    this._pxToPercent($target);
                    
                    if($target.hasClass('pop-window'))
                        this._checkPinedWindow(e.pageX, e.pageY, $btn);
                    else
                        this._bringBack($target);

                    $target.draggable('destroy');
                    this._LimitedDrag($btn, $target);
                }
            });
        });
    }

    _pxToPercent($target) {
        let max  = $(window).width();
        let left = $target.position().left / max * 100;
        
        $target.css('left', `${left}%`);
    }

    _checkPinedWindow(mouseX, mouseY, $btn) {
        var err = 2;

        if (mouseX < err)
            this.pinMenu('left-pop-window', $btn);
        else if (mouseY < err)
            this.pinMenu('top-pop-window', $btn);
        else
            this._bringBack(this._$window);
    }

    pinMenu(menuClass, $btn)
    {
        this._$window.addClass(menuClass);
        let $pin = this._$window.find('.move-pop-window'); 
        let $icon = $pin.find('i'); 
        $icon.addClass('bi-pin-angle');
        this._$window.resizable('disable');
        $icon.on('mousedown', () => 
        {
            $icon.removeClass('bi-pin-angle');
            this._$window.removeClass(menuClass);
            this._$window.resizable('enable');
            this._$window.trigger(menuClass);
            this._bringBack(this._$window);
        });
        this._$window.trigger(menuClass);
    }

    _setUpResponsive($target) {
        $(window).on('resize', (e)=> {
            if (e.target === window) {
                setTimeout(() => {
                    this._bringBack($target);
                }, 500);
            }
        });
    }

    // Trae devuelta $moved si se fue de la pantalla para top, left o right
    _bringBack($moved) 
    { 
        if ( ! $moved.hasClass('open') && $moved.hasClass('closeByDefault') )
            return; // Su posicion siempre es -100vw y no se lo puede mover
        
        let pos   = $moved.position();
      
        if (pos.top < 0)
            $moved.css('top', '0');
        if (pos.left < 0)
            $moved.css('left', '0');
        else 
        {
            let width = $moved.outerWidth();
            let max   = $(window).width();

            if(pos.left + width > max)
                $moved.css('left', `${(max-width)/max * 100 }%`);
            else 
            {
                let height = $moved.outerHeight();
                let max   = $(window).height();

                if(pos.top + height > max)
                    $moved.css('top', `${(max-height)/max * 100}%`);
            }
        }
      }
      

    // SetUp un boton para abrir la ventana
    addOpenBtn(openBtnQ) {
        let $open = $(openBtnQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window);
    }

    // Idem addOpenBtn, pero desaparece el boton y reaparece al cerrar la ventana
    addOpenToggleBtn(openBtnQ, openBtnContainerQ) {
        let $open   = $(openBtnQ);
        let $widget = $(openBtnContainerQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window);
        initPopUp(1, this._$closeBtn, $open, $widget)
    }

    // Idem addOpenToggleBtn, y ademas, setea drag al wiget que contiene al boton
    addOpenWidget(widgetQ) {
        let $widget = $(widgetQ);
        let $open = $widget.find('#open');
        let $move = $widget.find('.move-open-widget'); 
        this._setUpResponsive($widget);
        this.addOpenToggleBtn($open, $widget);        
        this._LimitedDrag($move, $widget);
    }

    isOpen() {
        return this._$window.hasClass('open');
    }

    hide() {
        if(this.isOpen())
            this._$window.removeClass('open');
    }

    show() {
        if( ! this.isOpen())
            this._$window.addClass('open');
    }

    toggle() {
        this._$window.toggleClass('open');
    }
}

export function initPopUp(opacity, openBtnQ, closeBtnQ, popupQ) {
    setPopUpEvent(opacity, openBtnQ, popupQ);
    setPopUpEvent(opacity, closeBtnQ, popupQ, 'closing');
}

export function setPopUpEvent(opacity, btnQuery, windowQuery, animClass='opening',
event='click', finalClass='open') 
{
    const root = document.documentElement;
    let $window = $(windowQuery);
    let $btn = $(btnQuery); 
    $btn.on(event, function(){ 
        root.style.setProperty('--final-opacity', String(opacity));
        $window.toggleClass(finalClass);
        $window.addClass(animClass);
        let cssVars = getComputedStyle(document.documentElement);
        let timer = cssVars.getPropertyValue('--anim-duration');
        timer = timer.substring(0,timer.length) // 0.25s -> 0.25
        timer = parseFloat(timer)*1000;
        setTimeout(()=>{
            $window.removeClass(animClass);    
        }, timer);
    });
}
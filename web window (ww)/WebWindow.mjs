export class WebWindow 
{
    constructor(windowId, timer=1000) 
    {
        this._$window   = $(`#${windowId}`);
        this._$closeBtn = this._$window.find('.close-pop-window');
        let $move       = this._$window.find('.move-pop-window');

        this._initResizable();
        this._LimitedDrag($move, this._$window);
        this._setUpResponsive(this._$window);
    }

    _initResizable() {
        this._$window.resizable({
            handles: "all",
            stop: (e) => {
                let $target = $(e.target);
                let width   = $target.width() / $(window).width()  * 100;
                
                $target.css('width', `${width}%`);
            }
        });
    }

    // $target solo tiene drag presionando $btn y drop dentro de window 
    _LimitedDrag($btn, $target) 
    {
        let onWindowOut = (e) => {
            let err = -2;
            if (e.pageY <= err)
                this._$window.addClass('top-pop-window');
        };
        let onWindowEnter = (e) => {
            let err = -2;
            if (e.pageY >= err)
                this._$window.removeClass('top-pop-window');
        };
        $btn.one('mousedown', (e) => 
        {   
            let inFlag=true;
            $target.draggable({
                start: (e) => 
                {
                    $('body').on("mouseleave", onWindowOut);
                    $('body').on("mouseenter", onWindowEnter);
                },
                drag: (e) => {
                    let err = 2;
                    if (e.pageX <= err) {
                        this._$window.addClass('left-pop-window');
                        inFlag = false;
                    } else if (e.pageX > err && ! inFlag) 
                        this._$window.removeClass('left-pop-window');
                },
                stop: (e) => 
                { 
                    $('body').off("mouseleave", onWindowOut);
                    $('body').off("mouseenter", onWindowEnter);
                    
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

    pinMenu(menuClass)
    {
        this._$window.addClass(menuClass);
        let $icon = this._$window.find('.move-pop-window i'); 
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
        setPopUpEvent(0.9, $open, this._$window, 'opening', false);
    }

    setDefaultCloseBtn() {
        setPopUpEvent(0.9, this._$closeBtn, this._$window, 'closing');
    }

    // Idem addOpenBtn, pero desaparece el boton y reaparece al cerrar la ventana
    addOpenToggleBtn($open, openBtnContainerQ) {
        $open   = $($open);
        let $widget = $(openBtnContainerQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window);
        initPopUp(1, this._$closeBtn, $open, $widget, 'leaving', 'coming');
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

export function initPopUp(opacity, openBtnQ, closeBtnQ, popupQ, animA='opening',
                          animB='closing') 
{
    setPopUpEvent(opacity, openBtnQ, popupQ, animA);
    setPopUpEvent(opacity, closeBtnQ, popupQ, animB);
}

export function setPopUpEvent(opacity, btnQuery, windowQuery, animClass='opening',
                              toggle=true, event='click', finalClass='open') 
{
    const root = document.documentElement;
    let $window = $(windowQuery);
    let $btn = $(btnQuery); 
    $btn.on(event, function(){ 
        root.style.setProperty('--final-opacity', String(opacity));
        if(toggle)
            $window.toggleClass(finalClass);
        else if ( ! $window.hasClass(finalClass) )
            $window.addClass(finalClass);
        else
            return;
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
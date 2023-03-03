export class WinController {
    constructor(windowQ, closeBtnQ, moveBtnQ, timer=1000) 
    {
        this._alert = $('#msg');
        this._alert2 = $('#msg-dos');
        this._$window = $(windowQ);
        this._$closeBtn  = $(closeBtnQ);
        this._initResizable();
        this._LimitedDrag($(moveBtnQ), this._$window);
        this._setUpResponsive(this._$window);
    }

    _initResizable() {
        this._$window.resizable({
            handles: "all",
            stop: (e) => {
                let $target = $(e.target);
                let max     = $(window).width();
                let width   = $target.width()  / max * 100;
                max         = $(window).height();
                let height  = $target.height() / max * 100;
                
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
                drag: function(e, ui) {
                    
                },
                stop: (e) => 
                { 
                    let max  = $(window).width();
                    let left = $target.position().left / max * 100;
                    
                    $target.css('left', `${left}%`);
                    this._bringBack($target);
                    $target.draggable("destroy");
                    this._LimitedDrag($btn, $target);

                    if(! $(e.target).hasClass('pop-window'))
                        return;

                    var mouseX = e.pageX;
                    var mouseY = e.pageY;
                    var windowWidth = $(window).width();
                    var threshold = 2; // Umbral en píxeles para el borde de la ventana
                    if (mouseX < threshold) {            
                        this.pinMenu('left-pop-window');
                    }
                    if (mouseX > windowWidth - threshold) {
                        this.pinMenu('right-pop-window');
                    }
                    if (mouseY < threshold) {
                        this.pinMenu('top-pop-window');
                    }
                }
            });
        });
    }

    pinMenu(menuClass)
    {
        this._$window.addClass(menuClass);
        let $pin = this._$window.find('.move-pop-window'); 
        let $icon = $pin.find('i.bi-arrows-move'); 
        $icon.removeClass('bi-arrows-move');
        $icon.addClass('bi-pin-angle');
        this._$window.resizable('disable');
        $pin.on('mousedown', () => 
        {
            $icon.removeClass('bi-pin-angle');
            $icon.addClass('bi-arrows-move');
            this._$window.removeClass(menuClass);
            this._$window.resizable('enable');
        });
        this._$window.trigger(menuClass);
    }

    _setUpResponsive($target) {
        $(window).on('resize', (e)=> {
            if (e.target === window)
                this._bringBack($target);
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
                $moved.css('left', max-width);
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
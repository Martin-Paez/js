export class WinController {
    constructor(windowQ, closeBtnQ, moveBtnQ, timer=1000) 
    {
        this._$window = $(windowQ);
        this._$closeBtn  = $(closeBtnQ);
        this._$window.resizable({ handles: "all" });
        this._initDraggable($(moveBtnQ), this._$window);
        this._timer = timer;
    }

    _initDraggable($btn, $target) {
        $btn.on('mousedown', () => {
          let keepInside = (event, ui) => {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var width = this._$window.outerWidth();
            var height = this._$window.outerHeight();
            var left = ui.position.left;
            var top = ui.position.top;
            if (left + width > windowWidth) {
              ui.position.left = windowWidth - width - 10;
            }
            if (top < 0) {
              ui.position.top = 0;
            }
          };
          $target.draggable({ drag: keepInside });
          $(window).resize(() => {
            let windowWidth = $(window).width();
            let windowHeight = $(window).height();
            let width = this._$window.outerWidth();
            let height = this._$window.outerHeight();
            let left = this._$window.offset().left;
            let top = this._$window.offset().top;
            if (left + width > windowWidth) {
              this._$window.offset({ left: windowWidth - width - 10 });
            }
            if (top < 0) {
              this._$window.offset({ top: 0 });
            }
          });
          $btn.on('mouseup', () => {
            $target.draggable("destroy");
            this._initDraggable($btn, $target);
          });
        });
      }

    _initFreeDraggable($btn, $target) {
        $btn.on('mousedown', () => {
            $target.draggable();
            $btn.on('mouseup', () => {
                $target.draggable("destroy");
                this._initFreeDraggable($btn, $target);
            });
        });
    }

    addOpenBtn(openBtnQ) {
        let $open = $(openBtnQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window, this._timer);
    }

    addOpenToggleBtn(openBtnQ, openBtnContainerQ) {
        let $open   = $(openBtnQ);
        let $widget = $(openBtnContainerQ);
        initPopUp(0.9, $open, this._$closeBtn, this._$window, this._timer);
        initPopUp(1, this._$closeBtn, $open, $widget, this._timer)
    }

    addOpenWidget(widgetQ) {
        let $widget = $(widgetQ);
        let $open = $widget.find('#open');
        let $move = $widget.find('.move-open-widget'); 
        this._initFreeDraggable($move, $widget);
        this.addOpenToggleBtn($open, $widget);
    }
}

export function initPopUp(opacity, openBtnQ, closeBtnQ, popupQ, timer) {
    setPopUpEvent(opacity, openBtnQ , popupQ, timer);
    setPopUpEvent(opacity, closeBtnQ, popupQ, timer, 'closing');
}

export function setPopUpEvent(opacity, btnQuery, windowQuery, animDur, animClass='opening',
event='click', finalClass='open') 
{
    const root = document.documentElement;
    let window = $(windowQuery);
    let btn = $(btnQuery); 
    btn.on(event, function(){ 
        root.style.setProperty('--final-opacity', String(opacity));
        window.toggleClass(finalClass);
        window.addClass(animClass);
        setTimeout(()=>{
            window.removeClass(animClass);    
        }, animDur);
    });
}
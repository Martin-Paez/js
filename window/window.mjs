export class WinController {
    constructor(windowQ, closeBtnQ) 
    {
       this._$window = $(windowQ);
       this._$closeBtn  = $(closeBtnQ);
    }

    addOpenBtn(btnQ) {
        initPopUp(btnQ, this._$closeBtn, this._$window, 1000);
    }
}

export function initPopUp(openBtnQ, closeBtnQ, popupQ, timer) {
    setPopUpEvent(openBtnQ , popupQ, timer);
    setPopUpEvent(closeBtnQ, popupQ, timer, 'closing');
}

export function setPopUpEvent(btnQuery, windowQuery, animDur, animClass='opening',
event='click', finalClass='open') 
{
    let window = $(windowQuery);
    let btn = $(btnQuery); 
    btn.on(event, function(){ 
        window.toggleClass(finalClass);
        window.addClass(animClass);
        setTimeout(()=>{
            window.removeClass(animClass);    
        }, animDur);
    });
}
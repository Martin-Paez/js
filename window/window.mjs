export class WinController {
    constructor(namespace = "") 
    {
        if(namespace !== "")
            this._namespace = '.' + namespace;
        else
            this._namespace = "";
    }

    addOpenBtn(btnQ) {
        let closeBtn = `.close-pop-window${this._namespace}`;
        let window   = `.pop-window${this._namespace}`;

        initPopUp(btnQ, closeBtn, window, 1000);
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
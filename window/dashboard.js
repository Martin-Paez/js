document.addEventListener("DOMContentLoaded", function() {

    loadGraphs($('.nav-link:first'));

    $('.nav-link').on('click', function() {
        let pane = $(`#${this.data('bs-target')}`); 
        
    });

    addWindowOpenBtn('#open');

});

function addWindowOpenBtn(openBtnQ) {
    initPopUp(openBtnQ, '.close-pop-window', '.pop-window', 1000);
}

function initPopUp(openBtnQ, closeBtnQ, popupQ, timer) {
    setPopUpEvent(openBtnQ , popupQ, timer);
    setPopUpEvent(closeBtnQ, popupQ, timer, 'closing');
}

function setPopUpEvent(btnQuery, windowQuery, animDur, animClass='opening', event='click', finalClass='open') 
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

function loadGraphs() {
    
}
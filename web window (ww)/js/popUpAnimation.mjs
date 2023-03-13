import * as _ from './cssAnimate.mjs';

export function initPopUp(openBtnQ, closeBtnQ, popupQ, animA = 'opening',
    animB = 'closing')
{
    setPopUpEvent(openBtnQ, popupQ, animA);
    setPopUpEvent(closeBtnQ, popupQ, animB);
}

export function setPopUpEvent(btnQuery, windowQuery,
    animClass = 'opening',
    isToggleBtn = true,
    opacity = 1,
    event = 'click',
    finalClass = 'open',
    cssVarDuration = '--anim-duration',
    cssVarFinalOpacity = '--final-opacity')
{
    let $window = $(windowQuery);
    let $btn = $(btnQuery);

    $btn.on(event, function ()
    {
        _.setCssVar(cssVarFinalOpacity, String(opacity));

        if (isToggleBtn)
            $window.toggleClass(finalClass);
        else if ($window.hasClass(finalClass))
            $window.addClass(finalClass);
        else
            return;

        let seconds = _.getCssVar(cssVarDuration);
        _.animate($window, animClass, _.cssSecondsToMillis(seconds));
    });
}

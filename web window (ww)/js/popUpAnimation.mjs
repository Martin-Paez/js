import * as _ from './cssAnimate.mjs';

export function initPopUp(openBtnQ, closeBtnQ, popupQ, animA = 'opening',
    animB = 'closing')
{
    setPopUpEvent(openBtnQ, closeBtnQ, popupQ, animA);
    setPopUpEvent(closeBtnQ, openBtnQ, popupQ, animB);
}

export function setPopUpEvent(openQ, closeQ, windowQuery,
    animClass = 'opening',
    isToggleBtn = true,
    event = 'click',
    finalClass = 'open',
    cssVarDuration = '--anim-duration')
{
    let $window = $(windowQuery);
    let $open = $(openQ);
    let $close = $(closeQ);

    $open.on(event, function ()
    {
        if (isToggleBtn)
        {
            $window.toggleClass(finalClass);
            $close.toggleClass(finalClass);
        }
        else if ($window.hasClass(finalClass))
            $window.addClass(finalClass);
        else
            return;

        let seconds = _.getCssVar(cssVarDuration);
        _.animate($window, animClass, _.cssSecondsToMillis(seconds));
    });
}

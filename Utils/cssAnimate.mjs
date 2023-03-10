export function animate($window, animClass, millis)
{
    $window.addClass(animClass);
    setTimeout(() =>
    {
        $window.removeClass(animClass);
    }, millis);
}

export function setCssVar(varName, value)
{
    const root = document.documentElement;
    root.style.setProperty(varName, value);
}

export function getCssVar(cssVar)
{
    let cssVars = getComputedStyle(document.documentElement);
    return cssVars.getPropertyValue(cssVar);
}

export function cssSecondsToMillis(seconds)
{
    seconds = seconds.substring(0, seconds.length) // 0.25s -> 0.25
    return parseFloat(seconds) * 1000;
}
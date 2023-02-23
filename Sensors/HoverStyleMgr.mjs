import {HoverMgr} from './HoverMgr.mjs'

export class HoverStyleMgr extends HoverMgr 
{
    constructor(selectorQuery, targetQuery, overVal, outVal=overVal,
        onOverExtra = ()=>{}, onOutExtra = ()=>{}) 
    {
        super(selectorQuery, targetQuery, overVal, outVal,
            onOverExtra, onOutExtra);
    }

    setVal($target, val)
    {
        $target.attr('style', val);
    }
}
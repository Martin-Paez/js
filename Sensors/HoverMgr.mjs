export class HoverMgr 
{
    constructor(selectorQuery, targetQuery, overVal, outVal=overVal,
    onOverExtra = ()=>{}, onOutExtra = ()=>{})
    {
        if (new.target === HoverMgr)
            throw new TypeError('HoverMgr es abstracta, no se puede instanciar. ');
        this.selector = $(selectorQuery);
        this.target = $(targetQuery);
        this.deepTarget = this.selector.find(this.target);
        this.overVal = overVal;
        this.outVal = outVal;
        this.onOverExtra = onOverExtra;
        this.onOutExtra = onOutExtra;
    }

    setVal($target, $val) 
    {
        throw new Error(`Metodo abstracto setVal no implementado`);
    }
    
    cssHover(over=this.overVal, out=this.outVal, target=()=>{return this.selector;})
    {
        this.selector.on('mouseover', () => {
            this.setVal(target(), over);
            this.onOverExtra();
        });
        this.selector.on('mouseout', () => {
            this.setVal(target(), out);
            this.onOutExtra();
        });
    }

    hover(over=this.overVal, out=this.outVal) 
    {
        this.cssHover(over, out, ()=>{return this.target;} ); 
    }

    deepHover(over=this.overVal, out=this.outVal) 
    {
        return this.cssHover(over, out, ()=>{return this.deepTarget;} );
    }

    hoverOff() {
        this.selector.off('mouseover');
        this.selector.off('mouseout');
    }
}
import { Buttons } from "./Buttons.mjs";
import { ToggleClass } from "./ToggleClass.mjs";

export class EffectBtns extends Buttons
{
    constructor(query, toggleClass, targetQuery) 
    {
        let action  = new ToggleClass($(targetQuery), toggleClass)

        super(query, action);
    }
}
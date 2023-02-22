import { Button } from "./Button.mjs";

export class EffectBtn extends Button
{
    constructor(query, toggleClass) {
        this.query = $(query);
        super(this.query, new ToggleClass(this.query, toggleClass));
    }
}
import { Action } from "./Action.mjs";

export class ToggleClass extends Action
{
    constructor(targetQuery, className) {
        super();
        this.$target = $(targetQuery);
        this.class = className;
    }

    do() {
        this.$target.toggleClass(this.class);
    }
}
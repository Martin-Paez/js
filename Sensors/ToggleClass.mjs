import { IAction } from "./IAction.mjs";

export class ToggleClass extends IAction
{
    constructor($target, className) {
        this.$target = $target;
        this.class = className;
    }

    do() {
        this.$target.ToggleClass(this.class);
    }
}
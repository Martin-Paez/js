export class Action 
{
    constructor(callback) 
    {
        this.callback = callback;
    }

    do() 
    {
        this.callback();
    }
}

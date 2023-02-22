export class Sensor 
{
    constructor(event, query, action) 
    {
        this.sel    = $(query);
        this.event  = event;
        this.action = action;

        this.sel.on(event, action);  
    } 
}

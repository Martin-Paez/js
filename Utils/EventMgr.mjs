export class EventMgr 
{
    constructor() 
    {
        this._on = {};
    }

    on(event, callback, ...args) 
    {
        event = event.trim();
        if(this._on[event] === undefined)
            this._on[event] = [];
        this._on[event].push({f: callback, args: [...args]});
    }
    
    off(event, callback)
    {        
        event = event.trim();
        let handlers = this._on[event] 

        if(handlers === undefined)
            return;

        let i=-1;
        while(++i < handlers.length && callback !== handlers[i]);
        if(i < handlers.length) 
            handlers.splice(i, 1);
    }

    emit(event) 
    {
        event = event.trim();
        (this._on[event] || []).forEach(handler => 
        {
            handler.f(...handler.args);
        });
    }
}
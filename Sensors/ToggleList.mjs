export class ToggleList 
{
    constructor(defaultEvent, handler=this.defaultHandler) {
        this.event = defaultEvent;
        this.handler = handler;
        this.list = [];
    }

    add(btn, value, target=btn, event=null) {
        this.list.push({
            selector: btn,
            value: value,
            target: target
        });
        btn.on(event||this.event, ()=> { this.toggle(); } )
    }

    toggle() 
    {
        this.list.forEach(elem => {
            this.handler(elem.target, elem.value);
        });
    }

    defaultHandler(target, value) {
        target.toggleClass(value);
    }
}
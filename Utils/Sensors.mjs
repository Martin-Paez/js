export class Sensors
{
    constructor(events, query, action, setEvents = true) 
    {
        if( ! Array.isArray(events) ) 
            events = [events];
        this.sel    = $(query);
        this.events  = events;
        this.action = ()=>{action.do()};  
        if(setEvents)
            this.on();
    } 

    emit() {
        this.action.do();
        return this;
    }

    on(eventList=this.events, action=this.action) {
        eventList.forEach(e => {
            this.sel.on(e, action);
        });
        return this;
    }

    one(eventList = this.events) {
        eventList.forEach(e => {
            this.sel.one(e, this.action);
        });
        return this;
    }
    
    off() {
        this.events.forEach(e => {
            this.sel.off(e, this.action); 
        });
        return this;
    }

    forceOff() {
        this.sel.off(); 
    }

    delEvent(event) {
        this.delEventList([event]);
    }

    delEventList(eventList) {
        let toDel = {};
        eventList.filter(function(e) {
            toDel[e] = this.action;
        });
        this.sel.off(toDel);
    }

    addEvent(event) {
        this.addEventList([event]);
    }

    addEventList(eventList) {
        this.events = this.events.concat(eventList);
        this.events = [...new Set(this.events)];
        this.on(eventList);
    }

    addSensor(query) {
        this.sel.add(query);
    }

    delSensor(query) {
        this.sel.not(query);
    }
}

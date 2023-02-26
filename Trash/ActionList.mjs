export class ActionList 
{
    constructor(actions) 
    {
        this.actions = this.toArray(actions);
    }

    do()
    {
        this.actions.forEach(a => {
            a.do();
        });
    }

    add(actions)
    {
        this.actions.concat(this.toArray(actions));
    }

    toArray(x)
    {
        if( ! Array.isArray(x) )
            return [x];
        return x;
    }
}
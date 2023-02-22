export class IAction 
{
    constructor() 
    {
        if(new.target === IAction)
            throw new TypeError("IAction es interfaz, no se puede instanciar.")
    }

    do() 
    {
        throw new Error(`Metodo "do" de "IAction" no implementado`);
    }
}

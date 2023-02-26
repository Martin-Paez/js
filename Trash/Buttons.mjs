import {Sensors} from './Sensors.mjs';

export class Buttons extends Sensors
{
    constructor(query, action) 
    {
        super('click', query, action);
    }
}
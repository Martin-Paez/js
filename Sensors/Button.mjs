import {Sensor} from './Sensor.mjs';

export class Button extends Sensor 
{
    constructor(query, action) 
    {
        super('click', query, action);
    }
}
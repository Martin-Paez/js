import {Sensors} from './Sensors.mjs';

export class OnHover extends Sensors
{
    constructor(query, action) 
    {
        super(['mouseover', 'mouseout'], query, action);
    }
}
import { GraphFactory  } from "./GraphFactory.mjs";
import { speedometer2  } from "../opts-hchart.mjs";
import { speedometer   } from "../opts-hchart.mjs";
import { gauge         } from "./opts-hchart.mjs";

export class GaugeFactory extends GraphFactory
{
    constructor(source, title="", units, opts = GaugeFactory.defaultOpts())
    {   
        super(source, 1, title, units, opts);
    }
    
    static defaultOpts()
    {
        let opts = GraphFactory.defaultOpts();
        opts.gridCols = 2;
        return opts;
    }

    createChart(type) {
        if (type === 'gauge')
            return speedometer(this);
        if (type === 'gauge2')
            return speedometer2(this); 
        if (type === 'solidgauge')
            return gauge(this);
        return null;
    }

    x() {
        return this._source.x(1);
    }

    y(i) {
        return this._source.y(i, 1);
    }
}
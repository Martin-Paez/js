import { genericChart } from './opts-hchart.mjs';

export class GraphFactory 
{
    constructor(source, n, title="", units, opts = GraphFactory.defaultOpts())
    {
        this._source = source;
        this._n      = n;
        this._title  = title;
        this._units  = units;
        this._opts   = opts; 
    }

    static defaultOpts(closeCallback = () => {})
    {
        let opts = {
            tooltip     : {enabled: true} ,
            colorRef    : false,
            rotation    : 0    ,
            timeUnits   : ""   , 
            gridCols    : 3    ,
            gridRows    : 4    , 
        };

        let crossIcon = '<i class="bi-x-circle"></i>'; 
        GraphFactory.addBtn(opts, crossIcon, 'closeBtn', closeCallback);
        opts.btns.enabled = false;
        opts.btns.buttons.contextButton = { enabled : false };
        
        return opts;
    }

    static addBtn(opts, html, btnName, callback = ()=>{}) {
        if( !opts.btns )
            opts.btns = {};
        if( !opts.btns.buttons )
            opts.btns.buttons = {};
            
        opts.btns.buttons[btnName] = { 
            text: html, 
            onclick: callback,
            theme: {fill:'transparent'},
            zIndex : 10001,
            y : -10,
        }; 
    }

    createChart(type) {
        return genericChart(type, this);
    }

    source() {
        return this._source;
    }

    title() {
        return this._title;
    }

    setTitle(title){
        this._title = title;
    }
    
    units() {
        return this._units;
    }
    
    btns() {
        return this._opts.btns;
    }

    tooltip() {
        return this._opts.tooltip;
    }

    n() {
        return this._n;
    }

    timeUnits() {
        return this._opts.timeUnits;
    }

    rotation() {
        return this._opts.rotation;
    }

    colorRef() {
        return this._opts.colorRef;
    }

    x(n) {
        return this._source.x(n);
    }

    y(i, n) {
        return this._source.y(i, n);
    }

    gridCols() {
        return this._opts.gridCols;
    }
    
    gridRows() {
        return this._opts.gridRows;
    }
}
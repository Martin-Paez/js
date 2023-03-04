export class Source 
{
    constructor(size, x, series, client, credentials, query)
    {
        this._creds  = credentials;
        this._client = client;
        this._query  = query;
        this._series = series;
        this._x      = x;
    }

    x(n) {
        return this._x.slice(-n);
    }

    y(n) {
        
    }
    
    subscribe() {
        if (! client.connected) {
            client.connect(options, function(error) {
            if (error) {
                console.log("Error al conectarse:", error);
            } else {
                console.log("Conexión exitosa!");
            }
            });
        }
          
        this._client.subscribe(query, ()=>{
            alert(`No fue posible subscribirse a ${query}`);
        });
        this._client.on('message', this.callback.bind(this));
    }

    desubscribe() {
        alert("Falta implementar Source.desubscribe");
    }

    callback(topic, message) {
        this._series[topico].data.concat(message.payload.values);
    }

}

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
        let close   = { text: 'X', symbol: null, onclick: closeCallback };
        let menu    = { buttons: { contextButton: close } };
        
        return { 
            menu        : menu,
            tooltip     : {enabled: true} ,
            colorRef    : false,
            rotation    : 0    ,
            timeUnits   : ""   , 
            gridCols    : 3    ,
            gridRows    : 4    , 
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
    
    menu() {
        return this._opts.menu;
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
        let chart = genericChart(type, this);
        chart.yAxis = { visible : false};
        return chart;
    }

    x() {
        return this._source.x(1);
    }

    y(i) {
        return this._source.y(i, 1);
    }
}

/**
 * Retorna un objeto de configuracion para crear un HighCharts.
 * 
 * Para crear el menu se puede usar HChartMenu o sus hijos.
 * 
 * @param {string} type
 *  Tipo de grafico : 'line', 'column', 'pie', etc.
 * 
 * @param {Graph} graph
 *  Instancia de Graph con los valores para configurar el grafico.
 */
export function genericChart(type, graph)
{
    let g       = graph;
    let opacity = 'rgba(255, 255, 255, 0.9)';

    let chart = {
            chart:    { type:               type         ,   // Line, Column, etc
                        margin:             40           ,   // Entre grafico y canvas       
                        backgroundColor:    opacity     },   // Cavas color
            credits:  { enabled:            false       },   // Quita hightcharts.com label 
            tooltip:                        g.tooltip()  ,   // Cartel con info de cada punto
            exporting:                      g.menu()     ,   // Menu del grafico
            title:    { text:               g.title()    ,   // Titulo del grafico
                        style:{
                            whiteSpace:     'nowrap'     ,   // Siempre en una linea
                            fontSize:       '1.5rem'   }},   // Texto responsivo
            legend:   { enabled:            g.colorRef()},   // Quita el Label de "Colores del Eje Y"
            yAxis:    { title:{ text:       g.units()    ,   // Unidades, label Ehe Y
                                style:
                                {   fontSize:  '14px'    , 
                                    fontWeight: 'bold'  },
                                offset:     10           ,   // Mover label horizontal
                                rotation:   0            ,   // Lo volteo, queda horizontal
                                align:      'high'       ,   // Poner arriba el label
                                y:          -30       ,}},   // Subir un poco mas el label
            series:/*[{ name:               'Variable',      
            yAxis       data:*/             g.y(0,g.n)/*}]*/,    // Datos del Eje Y [name: 'var', data:[1,2] ]
            xAxis:    { categories:         g.x(0,g.n)     ,    // Datos del Eje X [1,2,3]
                            labels:{ 
                                rotation:   g.rotation() },   // Rotar labels del Eje X
                            title: { 
                                text:       g.timeUnits() ,    // Unidades, label Eje X
                                style:
                                {   fontSize:  '14px'     , 
                                    fontWeight: 'bold'}   ,
                                offset:     10            ,     // Mover label horizontal
                                align:      'high'        ,     // Llevar el label al extremo derecho
                                x:          -20           ,     // Desplazar el label horizontalmente
                                y:          20            }},    // Bajar un poco el label
            plotOptions: {
                histogram: {
                    borderWidth: 10,
                    borderColor: 'white'
                }
            }
    };

    if (chart.tooltip.enabled) {
        tooltipOnClick(g.units());
        chart.tooltip.enabled = false;
    }

    return chart;
}

function tooltipOnClick(units) {
    Highcharts.addEvent(Highcharts.Point, 'click', function () {
        var point = this,
        chart = point.series.chart,
        tooltip = chart.tooltip,
        xPos = point.plotX + chart.plotLeft,
        yPos = point.plotY + chart.plotTop;

        tooltip.options.enabled = true;
        tooltip.options.positioner = function() {
            return { x: xPos, y: yPos };
        };
        tooltip.options.pointFormat = `{point.y:.2f}`;
        tooltip.options.formatter = function() {
            return Highcharts.numberFormat(this.y, 2);
        };
        
        tooltip.refresh(point);
        
        tooltip.options.enabled = false;
    });
}

export function speedometer(val, title, units, opts = defaultOpts()) 
{
    return {
            chart:    { type:               'gauge'         },
            exporting:                      opts.menu       ,
            title:    { text:               title           },
            credits:  { enabled:            false           },
            pane:     { startAngle:         -90             ,
                        endAngle:           89.9            ,
                        background:         null            ,
                        center:             ['50%', '75%']  ,
                        size:               '120%'          }, 
            yAxis:    { min:                0               ,   // Minimo valor
                        max:                200             ,   // Valor maximo a 90º
                        tickPixelInterval:  75              ,   // Divisiones del eje curvo
                        minorTickColor:     '#EEEEEE'       ,
                        minorTickLength :   5               ,
                        tickColor:          '#EEEEEE'       ,   // Marcas del eje blancas
                        tickLength:         20              ,   // Alto de las Marcas cortan el eje
                        labels:                             {
                            distance:       20              ,   // Distancia de los numeros al eje
                            style:{fontSize:'14px'          }}, // Numeros de las marcas
                        plotBands:                          [
                        {   from:           0               , 
                            to:             120             ,
                            color:          '#55BF3B'       ,   // Verde
                            thickness:      40              },  // Ancho del eje
                        {   from:           120             ,
                            to:             160             ,
                            color:          '#DDDF0D'       ,   // Amarillo
                            thickness:      40              },
                        {   from:           160             ,
                            to:             200             ,
                            color:          '#DF5353'       ,   // Rojo
                            thickness:      40              }]},
            series: [{  data:               [val]           ,
                        dataLabels: 
                        {   format:         `{y} ${units}`  ,
                            style:{fontSize:'12px'          }}}]
    };
    
    /*
    //let series = { ... graph.series[0] };                     // Shallow copy
    let series = JSON.parse(JSON.stringify(graph.series[0]));   // Deep copy          

    series.data = [series.data[series.data.length-1]];  
    graph.series = [series];*/
}

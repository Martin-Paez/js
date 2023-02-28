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

export class Gauge 
{
    constructor(source, title="", opts = Graph.defaultOpts())
    {
        this._source = source;
        this._title  = title;
        this._opts   = opts; 
    }

    static defaultOpts()
    {
        return { 
            menu : {enabled: false},
        };
    }

    source() {
        return this._source;
    }

    title() {
        return this._title;
    }

    menu() {
        return this._opts.menu;
    }
}

export class Graph extends Gauge
{
    constructor(source, n, title="", yUnits, opts = Graph.defaultOpts())
    {
        super(source, title, opts);
        this.yUnits = yUnits;
        this.n = n;
    }

    static defaultOpts()
    {
        let opts = super.defaultOpts();
        let adds = { 
            xTitle      :   "",
            tooltip     :   true,
            rotation    :   0,
            colorsRef   :   false
        };
        return Highcharts.merge(opts, adds);
    }

    yUnits() {
        return this._yUnits;
    }

    n() {
        return this._n;
    }

    xTitle() {
        return this._opts.xTitle;
    }

    tooltip() {
        return this._opts.tooltip;
    }

    rotation() {
        return this._opts.rotation;
    }

    colorRef() {
        return this._opts.colorRef;
    }
}

export function chartStruct(type, graph) 
{
    let g = graph;
    return genericChart(type, g.n(), g.x(), g.y(), )
}

/*
 * Retorna un objeto de configuracion para crear un graico con HighCharts.
 *
 * y de be ser una lista de objetos con la siguiente estructura:
 *      y = [
 *              { name : "Variable 1", data : [ ... ] },
 *              { name : "Variable N", data : [ ... ] }
 *          ]
 * 
 * Para crear el menu se puede usar HChartMenu o sus hijos.
 */
export function genericChart(type, n, x, y, title="", yUnits, {xTitle, menu ,tooltip ,
                                        rotation , colorsLabel } = defaultOpts())
{
    let graph = {
            chart:    { type:               g.type()    },   // Tipo de grafico
            credits:  { enabled:            false       },   // Quita hightcharts.com label 
            tooltip:  { enabled:            false       },   // Cartel con info de cada punto
            exporting:                      g.menu()     ,   // Menu del grafico
            title:    { text:               g.title()   },   // Titulo del grafico
            legend:   { enabled:            g.colorRef()},   // Quita el Label de "Colores del Eje Y"
            yAxis:    { title:{ text:       g.yUnits()   ,   // Unidades, label Ehe Y
                                style:
                                {   fontSize:  '14px'    , 
                                    fontWeight: 'bold'  },
                                offset:     10           ,   // Mover label horizontal
                                rotation:   0            ,   // Lo volteo, queda horizontal
                                align:      'high'       ,   // Poner arriba el label
                                y:          -30       ,}},// Subir un poco mas el label
            series:/*[{ name:               'Variable',      
            yAxis       data:*/             g.y(0,n)/*}]*/,    // Datos del Eje Y [name: 'var', data:[1,2] ]
            xAxis:    { categories:         g.x(0,n)     ,    // Datos del Eje X [1,2,3]
                            labels:{ 
                                rotation:   g.rotation() },   // Rotar labels del Eje X
                            title: { 
                                text:       g.xTitle()    ,    // Unidades, label Ehe X
                                style:
                                {   fontSize:  '14px'     , 
                                    fontWeight: 'bold'}   ,
                                offset:     10            ,     // Mover label horizontal
                                align:      'high'        ,     // Llevar el label al extremo derecho
                                x:          -20           ,     // Desplazar el label horizontalmente
                                y:          20            }}    // Bajar un poco el label
            //plotOptions:{ line:    { /* Style del grafico de linea */ },
    };

    if (tooltip)        // click para Mostrar/Ocultar los valores al pasar el mouse  
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
            tooltip.options.pointFormat = '{point.y:.2f}';
            tooltip.options.formatter = function() {
                return Highcharts.numberFormat(this.y, 2);
            };
            tooltip.refresh(point);
            
            tooltip.options.enabled = false;
        });
    return graph;
}

export function speedometer(val, title, units, opts = defaultOpts()) 
{
    if (opts.menu === null)  
        opts.menu = {enabled: false};

    return  {
            chart:    { type:               'gauge'         },
            exporting:                      opts.menu       ,
            tooltip:  { enabled:            false           },
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

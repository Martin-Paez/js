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
        this._series[topic].data.concat(message.payload.values);
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
    let opacity = 'rgba(255, 255, 255, 0.95)';

    let chart = {
            chart:    { type:               type         ,   // Line, Column, etc
                        margin:             40           ,   // Entre grafico y canvas      
                        backgroundColor:    opacity      },   // Cavas color
            credits:  { enabled:            false       },   // Quita hightcharts.com label 
            tooltip:                        g.tooltip()  ,   // Cartel con info de cada punto
            exporting:                      g.btns()     ,   // Menu del grafico
            title:    { text:               g.title()    ,   // Titulo del grafico
                        style:{
                            fontSize: '1.5rem',
                            whiteSpace:     'nowrap'     ,   // Siempre en una linea
                            }},   // Texto responsivo
            legend:   { enabled:            g.colorRef()},   // Quita el Label de "Colores del Eje Y"
            yAxis:    { title:{ text:       g.units()    ,   // Unidades, label Ehe Y
                                style:
                                {   fontSize:  '14px'    , 
                                    fontWeight: 'bold'  },
                                offset:     10           ,   // Mover label horizontal
                                rotation:   0            ,   // Lo volteo, queda horizontal
                                align:      'high'       ,   // Poner arriba el label
                                gridLineWidth:  4        ,
                                gridLineColor:  'red'    ,
                                y:          -30       ,}},   // Subir un poco mas el label
            series:/*[{ name:               'Variable',      
            yAxis       data:*/             g.y(0,g.n)/*}]*/,// Datos del Eje Y [name: 'var', data:[1,2] ]
            xAxis:    { categories:         g.x(0,g.n)    ,  // Datos del Eje X [1,2,3]
                            labels:{ 
                                rotation:   g.rotation() },  // Rotar labels del Eje X
                            title: { 
                                text:       g.timeUnits() ,  // Unidades, label Eje X
                                style:
                                {   fontSize:  '14px'     , 
                                    fontWeight: 'bold'}   ,
                                offset:     10            ,   // Mover label horizontal
                                align:      'high'        ,   // Llevar el label al extremo derecho
                                x:          -20           ,   // Desplazar el label horizontalmente
                                y:          20            }}, // Bajar un poco el label
    };

    setUpButtons(chart);

    if (chart.tooltip.enabled) {
        tooltipOnClick(g.units());
        chart.tooltip.enabled = false;
    }

    return chart;
}

function setUpButtons(chart) {
    let style  = { fontSize: '20px', color: '#888' };
    let states = { hover: { style: { color: '#000' } } };
    chart.navigation = { buttonOptions: { useHTML: true, theme: {
        style: style,
        states: states,
    }}};
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

export function gauge(gauge)
{
    let g = gauge;
    let opacity = 'rgba(255, 255, 255, 0.92)';
    let chart = {
        chart:    { type:               'solidgauge'    ,
                    backgroundColor:    opacity         },
        exporting:                      g.btns()        ,
        title:    { text:               g.title()       ,
            style:{
            whiteSpace:     'nowrap'     ,   // Siempre en una linea
            }},   // Texto responsivo
        credits:  { enabled:            false           },
        pane:     { startAngle:         -90             ,
                    endAngle:           89.9            ,
                    background:         null            ,
                    center:             ['50%', '100%']  ,
                    size:               '200%'          }, 
                    
                    background: {
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    },

        yAxis:    { min:                0               ,   // Minimo valor
                    max:                100             ,   // Valor maximo a 90º
                    stops: [
                        [0.1, '#55BF3B'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ],
                    minorTickInterval: null,
                    tickAmount: 2,

                    labels:                             {
                        distance:       20              ,   // Distancia de los numeros al gauge
                        style:{
                            // Siempre en una linea
                         fontSize:       '14px'   }}},   // Texto responsivo
        plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 10,
                            borderWidth: 0,
                        }
                    }
                },

        series: [{  data:               [g.y(0)[0].data[0]],
                    dataLabels: 
                    {   format:         `{y} ${g.units()}`,
                        style:{fontSize:'16px'          }}}]
    }
    
    setUpButtons(chart);
    return chart;
}

export function speedometer(gauge)
{
    let g = gauge;
    let opacity = 'rgba(255, 255, 255, 0.92)';
    let chart = {
            chart:    { type:               'gauge'         ,
                        margin:             0               ,
                        padding:            0               ,
                        backgroundColor:    opacity         ,},
            exporting:                      g.btns()        ,
            title:    { text:               g.title()       ,style:{
                whiteSpace:     'nowrap'     ,   // Siempre en una linea
                }},   // Texto responsivo
            credits:  { enabled:            false           },
            pane:     { startAngle:         -90             ,
                        endAngle:           89.9            ,
                        background:         null            ,
                        center:             ['50%', '100%']  ,
                        size:               '200%'          }, 
            yAxis:    { min:                0               ,   // Minimo valor
                        max:                100             ,   // Valor maximo a 90º
                        tickPixelInterval:  50              ,   // Divisiones del eje curvo
                        minorTickColor:     '#EEEEEE'       ,
                        minorTickLength :   5               ,
                        tickColor:          '#EEEEEE'       ,   // Marcas del eje blancas
                        tickLength:         10              ,   // Alto de las Marcas cortan el eje curvo
                        labels:                             {
                            distance:       -30              ,   // Distancia de los numeros al gauge
                            style:{fontSize:'14px', color: 'black', fontWeight: 'bold'          }}, // Numeros de las marcas
                        plotBands:                          [
                        {   from:           0               , 
                            to:             60              ,
                            color:          '#46785A'       ,   // Verde
                            thickness:      '100%'              },  // Ancho del eje curvo
                        {   from:           60              ,
                            to:             85              ,
                            color:          '#84E835'       ,   // Amarillo
                            thickness:      '100%'              },
                        {   from:           85              ,
                            to:             100             ,
                            color:          '#A6E97F'       ,   // Rojo
                            thickness:      '100%'              }]},
            series: [{  data:               [g.y(0)[0].data[0]],
                        dataLabels: 
                        {   
                            format:         ""/*`{y} ${g.units()}`*/,
                            style:{fontSize:'16px'          }},
                            dial: {
                                radius: '80%',
                                backgroundColor: 'black',
                                baseWidth: 8,
                                baseLength: '0%',
                                rearLength: '0%',
                            },
                            pivot: {
                                backgroundColor: 'black',
                                radius: 3,
                                offsetY: 20,
                            }}],
            plotOptions: {
                gauge: {
                    dataLabels: {
                        borderWidth: 0,
                    }
                }
            }
    };
    
    setUpButtons(chart);
    return chart;
}


export function speedometer2(gauge)
{
    let g = gauge;
    let opacity = 'rgba(255, 255, 255, 0.92)';
    let chart = {
            chart:    { type:               'gauge'         ,
                        backgroundColor:    opacity         ,},
            exporting:                      g.btns()        ,
            title:    { text:               g.title()       ,style:{
                whiteSpace:     'nowrap'     ,   // Siempre en una linea
                }},   // Texto responsivo
            credits:  { enabled:            false           },
            pane:     { startAngle:         -90             ,
                        endAngle:           89.9            ,
                        background:         null            ,
                        center:             ['50%', '100%']  ,
                        size:               '180%'          }, 
            yAxis:    { min:                0               ,   // Minimo valor
                        max:                100             ,   // Valor maximo a 90º
                        tickPixelInterval:  50              ,   // Divisiones del eje curvo
                        minorTickColor:     '#EEEEEE'       ,
                        minorTickLength :   5               ,
                        tickColor:          '#EEEEEE'       ,   // Marcas del eje blancas
                        tickLength:         20              ,   // Alto de las Marcas cortan el eje curvo
                        labels:                             {
                            distance:       20              ,   // Distancia de los numeros al gauge
                            style:{fontSize:'14px'          }}, // Numeros de las marcas
                        plotBands:                          [
                        {   from:           0               , 
                            to:             60              ,
                            color:          '#55BF3B'       ,   // Verde
                            thickness:      30              },  // Ancho del eje curvo
                        {   from:           60              ,
                            to:             85              ,
                            color:          '#DDDF0D'       ,   // Amarillo
                            thickness:      30              },
                        {   from:           85              ,
                            to:             100             ,
                            color:          '#DF5353'       ,   // Rojo
                            thickness:      30              }]},
            series: [{  data:               [g.y(0)[0].data[0]],
                        dataLabels: 
                        {   
                            format:         ""/*`{y} ${g.units()}`*/,
                            style:{fontSize:'16px'          }},
                            dial: {
                                radius: '80%',
                                backgroundColor: 'grey',
                                baseWidth: 6,
                                baseLength: '0%',
                                rearLength: '0%',
                            },
                            pivot: {
                                backgroundColor: 'grey',
                                radius: 3,
                            }}],
            plotOptions: {
                gauge: {
                    dataLabels: {
                        borderWidth: 0,
                    }
                },
            }
    };
    
    setUpButtons(chart);
    return chart;
}


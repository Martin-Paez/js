export function defaultOpts()
{
    return { 
        xTitle      :   "",
        rotation    :   0,
        tooltip     :   true,
        menuBtns    :   null,
        colorsLabel :   false
    };
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
export function genericChart(type, x, y, title="", yUnits, {xTitle, menu ,tooltip ,
                                        rotation , colorsLabel } = defaultOpts())
{
    let graph = {
            chart:    { type:               type        },   // Tipo de grafico
            credits:  { enabled:            false       },   // Quita hightcharts.com label 
            tooltip:  { enabled:            false       },   // Cartel con info de cada punto
            title:    { text:               title       },   // Titulo del grafico
            legend:   { enabled:            colorsLabel },   // Quita el Label de "Colores del Eje Y"
            yAxis:    { title:{ text:       yUnits       ,   // Unidades, label Ehe Y
                                style:
                                {   fontSize:  '14px'    , 
                                    fontWeight: 'bold'  },
                                offset:     10           ,   // Mover label horizontal
                                rotation:   0            ,   // Lo volteo, queda horizontal
                                align:      'high'       ,   // Poner arriba el label
                                y:          -30          ,}},// Subir un poco mas el label
            series:/*[{ name:               'Variable',      
            yAxis       data:*/             y   /*}]*/   ,    // Datos del Eje Y [name: 'var', data:[1,2] ]
            xAxis:    { categories:         x            ,    // Datos del Eje X [1,2,3]
                            labels:{ 
                                rotation:   rotation   },   // Rotar labels del Eje X
                            title: { 
                                text:       xTitle      ,    // Unidades, label Ehe X
                                style:
                                {   fontSize:  '14px'   , 
                                    fontWeight: 'bold'} ,
                                offset:     10          ,     // Mover label horizontal
                                align:      'high'      ,     // Llevar el label al extremo derecho
                                x:          -20         ,     // Desplazar el label horizontalmente
                                y:          20          }}    // Bajar un poco el label
            //plotOptions:{ line:    { /* Style del grafico de linea */ },
    };

    if (menu !== null)  // Menu del grafico
        graph.exporting = menu;

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

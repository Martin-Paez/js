/*
 * Retorna un objeto de configuracion para crear un graico con HighCharts.
 *
 * y de be ser una lista de objetos con la siguiente estructura:
 *      y = [
 *              { name : "Variable 1", data : [ ... ] },
 *              { name : "Variable N", data : [ ... ] }
 *          ]
 * 
 * Para crear el objeto exporting se puede usar el metodo menu(...)
 */
export function generic_chart(type, x, y, title = "", yTitle = "", xTitle= "", menu = null,
                      tooltip = true, rotation = 0, colorsLabel = true) {
    return generic_chart2(type, x, y, {title: title, yTitle: yTitle, xTitle: "", menu: menu,
                               tooltip: tooltip, rotation: rotation, colorsLabel: colorsLabel});
}

export function generic_chart2(type, x, y, {title = "", yTitle = "", xTitle= "", menu = null, 
                                    tooltip = true, rotation = 0, colorsLabel = true}) {
    let graph = {

            chart:     { type:           type       ,
                pane: {
                    startAngle: -90,
                    endAngle: 89.9,
                    background: null,
                    center: ['50%', '75%'],
                    size: '110%'
                }, 
            },   // Tipo de grafico
            credits:   { enabled:        false      },   // Quita hightcharts.com label 
            tooltip:   { enabled:        false      },   // Cartel con info de cada punto
            title:     { text:           title      },   // Titulo del grafico
            legend:    { enabled:        colorsLabel},   // Quita el Label de "Colores del Eje Y"
            yAxis:     { title:{text:    yTitle     ,    // Unidades, label Ehe Y
                                offset:  10         ,    // Mover label horizontal
                                rotation: 0         ,    // Lo volteo, queda horizontal
                                align:  'high'      ,    // Poner arriba el label
                                y:      -30         ,}},  // Subir un poco mas el label
            series:  /*[{name:          'Variable',     // Label de abajo - "Colores del Eje Y"

            /* DATOS:
            yAxis        data:*/          y   /*}]*/,// Datos del Eje Y
            xAxis:     { categories:      x         ,    // Datos del Eje X
                labels:{ rotation:        rotation  },   // Rotar labels del Eje X
                title: { text:            xTitle    ,    // Unidades, label Ehe X
                         offset:          10        ,    // Mover label horizontal
                         align: 'high'              ,    // Llevar el label al extremo derecho
                         x: 0                       ,    // Desplazar el label horizontalmente
                         y: 20                      }}   // Bajar un poco el label
            
            //plotOptions:{ line:    { /* Style del grafico de linea */ },

    };
    if (menu !== null)  // Menu del grafico
        graph.exporting = menu;
    if (type==='gauge') {
        graph.series[0].dataLabels = {  // Etiqueta con la velocidad bajo la aguja
            format: '{y} km/h',
            borderWidth: 0,
            style: {
                fontSize: '16px'
            },
            y : 40
        };
        graph.pane = {      
            startAngle: -90, // Medio circulo
            endAngle: 89.9,
            background: null,   // Sin fondo gris
            center: ['50%', '75%'], // Centrado
            size: '110%' // Algo de zoom dentro del widget
        };
        graph.yAxis = {
            min: 0, // Minimo valor
            max: 200, // Valor maximo a 90º
            tickPixelInterval: 75,  // Divisiones del eje curvo
            minorTickColor: '#EEEEEE',
            minorTickLength : 5,
            tickColor: '#EEEEEE', // Marcas del eje blancas
            tickLength: 20,        // Alto de las Marcas cortan el eje
            labels: {
                distance: 20,       // Distancia de los numeros al eje
                style: {
                    fontSize: '14px'    // Numeros de las marcas
                }
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B', // Verde
                thickness: 20       // Ancho del eje
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D', // Amarillo
                thickness: 20
            }, {
                from: 160,
                to: 200,
                color: '#DF5353', // Rojo
                thickness: 20
            }]
        };
    
        graph.xAxis.categories = graph.xAxis.categories[0];
        
        //let series = { ... graph.series[0] };                     // Shallow copy
        let series = JSON.parse(JSON.stringify(graph.series[0]));   // Deep copy          

        series.data = [series.data[series.data.length-1]];  
        graph.series = [series];
    }
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

/*
 * Crea un menu para dar como atributo exporting a las opciones de inicializacion 
 * de Highcharts. Puede ser usando, por ejemplo, para dar un valor al atributo
 * exporting del metodo graph.
 * 
 * El parametro buttons es una lista y se pueden usar funciones como btnClose() o
 * menuSeparatorLine() para crear sus elementos.
 * 
 * Ejemplo:
 *      menuExporting([btnClose(), menuSeparatorLine()]);
 */ 
export function menuExporting(buttons) {
    var menu = {enabled: true, buttons: {}};
    
    var items = [];    
    buttons.forEach(function(btn) {
        items.push(btn);
    });
    menu.buttons.contextButton = { menuItems: items };
    return menu;
}

/* 
 * Boton que elimina el widget. Se usa en conjunto con menuExporting()
 *
 * Recibe una instancia de WidgetGrid
 */
export function closeBtn(widgetGrid) {
    return { text: 'Cerrar', onclick: function(){
        // "this" es el highchart y "this.container" es el Hijo del nodo container
        // entregado en las opciones de Highcharts.chart('name', {container: "html"}).
        // Con WidgetGrid el container tiene id igual al titulo del chart.
        widgetGrid.removeWidget(this.container.parentNode)
    }};
}

/* 
 * Boton que elimina el widget. Se usa en conjunto con menuExporting()
 *
 * Recibe una instancia de WidgetGrid
 */
export function showTableBtn(widgetGrid) {
    return { text: 'Tabla de valores', onclick: function(){
        // "this" es el highchart y "this.container" es el Hijo del nodo container
        // entregado en las opciones de Highcharts.chart('name', {container: "html"}).
        // Con WidgetGrid el container tiene id igual al titulo del chart.
        widgetGrid.chart.menu.options.showTable = true;
    }};
}

export function chartsButtonList() {
    /* Esta es la familia de los Highcharts
     * Hay mas, estan las familias : 
     *      Highcharts Stock
     *      Highcharts Maps
     *      Highcharts Gantt.
     */

    // Con la opcion polar se puede hacer por ej un graf de barras circular
    let discarded = ['bellcurve' /*areaspline*/, 'parallel'/*raro*/, 'funnel'/*marketing*/,
                   , 'networkgraph'/*raro, data relationship*/];
    let to_edit = ['scatter'/*nube de puntos, distribucion*/, 'boxplot'/*velas*/, 'sankey'/*raro*/,
                   'variwide'/*columnas*/, 'vector'/*mapa vectorial*/, 
                   'wordcloud'/*mapa palabras*/, 'xrange' /*diag. Gant*/,
                   'organization'/*arbol jerarquia*/,
                 /*'column' + config /*barras multicolor, comparacion de composiciones*/];
    let special = ["bubble"/*3 vars, distribucion, con skater se puede*/,
                   'heatmap' /*distribucion */,
                   'treemap' /*composicion*/, ];
    let others = ['sunburst'/*multi dona, jeraquia, composicion*/, 'timeline', 'polygon'];
    
    // Otros IoT : 
    // Radar: no es un tipo, si no un modo de configuracion con Polar: true
    // 'windbarb': direccion y velosidad del viento
    // 'windrose': para el viento
    // 'errorbar': sobre un grafico cada puntos tiene rangos de error

    let metrics = [['solidgauge','Indicador simple'], ['gauge', 'Indicador colores']];
    let history = [['line','Linea'], ['area','Area'], ['histogram', 'Histograma'],
                   ['waterfall', 'Cascada'], ['spline', 'Curva'], ['areaspline', 'Area curva']];
    let comparision = [['column','Columnas'], ['pie','Torta'], /*['pie' + config,'Donut'] */,
                       /*['column'] + config, ['Barras circular']*/, ['pyramid','Piramide'],
                       ['bar','Barras Horiz.']];

    let categs = [[metrics, 'METRICAS'], [history, 'HISTORIAL'], [comparision, 'COMPARACION']];

    let names = ['Linea', 'Curva', 'Area (linea)', 'Area (curva)', 'Barras', 'Barras Horiz.', 'Torta']
    let charts = [];
    
    categs.forEach( function(categ, i) {
        charts.push( { text: categ[1] } );
        charts.push(menuSeparatorLine());
        categ[0].forEach( function(type, i) {
            charts.push( { text: "- " + type[1], onclick: function(){
                this.update({
                    chart: {
                        type: type[0]
                    },
                });
            }});
        });
        charts.push(menuSeparatorLine());
    });
    return charts;
}

/* Linea grafica que separa opciones (o grupos de opciones) del menu.
 * Se usa en conjunto con menuExporting().
 */
export function menuSeparatorLine() {
    return { separator: true };
}
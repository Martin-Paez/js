
/* Los siguientes metodos corresponden a la familia de los Highcharts
 *
 * Hay mas, estan las familias : 
 *      Highcharts Stock
 *      Highcharts Maps
 *      Highcharts Gantt.
 * 
 * Ademas Con la opcion polar se puede hacer por ej un graf de barras circular
 * 
 */

export function comparision()
{
    let list = [['column', 'Barras'],
                ['pie', 'Torta'],
                /*['pie' + config,'Donut'] */,
                /*['column'] + config, ['Barras circular']*/,
                ['pyramid', 'Piramide'],
                ['bar', 'Barras Horiz.'],
                ['spline', 'Curva'],
                ['areaspline', 'Area Curva']];
    return { name: 'Comparacion', list: list};
}

export function history()
{
    let list = [['line', 'Linea'],
                ['area', 'Area'],
                ['histogram', 'Histograma'],
                ['waterfall', 'Cascada']];
    return { name: 'Historial', list: list};                
}

export function metrics()
{
    let list = [['solidgauge', 'Gauge'],
                ['gauge', 'Gauge'],
                ['gauge2', 'Gauge']];
    return { name: 'Metricas', list: list};
}

export function special()
{
    let list = ["bubble"  /*3 vars, distribucion, con skater se puede*/,
                'heatmap' /*distribucion */,
                'treemap' /*composicion*/,];
    return { name: 'Especial', list: list};
}

export function toEdit()
{
    let list = ['scatter'/*nube de puntos, distribucion*/,
                'boxplot'/*velas*/,
                'sankey'/*raro*/,
                'variwide'/*columnas*/,
                'vector'/*mapa vectorial*/,
                'wordcloud'/*mapa palabras*/,
                'xrange' /*diag. Gant*/,
                'organization'/*arbol jerarquia*/,
                /*'column' + config /*barras multicolor, comparacion de composiciones*/];
    return { name: 'Para editar', list: list};
}

export function others()
{
    let list = ['sunburst'/*multi dona, jeraquia, composicion*/,
                'timeline',
                'polygon'];
    return { name: 'Otros', list: list};
}

export function evenMore()
{
    let list = ['bellcurve' /*areaspline*/,
                'parallel'/*raro*/,
                'funnel'/*marketing*/,
                'networkgraph'/*raro, data relationship*/];
    return { name: 'Aun mas', list: list};
}

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
    return [['column', 'Barras'],
            ['pie', 'Torta'],
                        /*['pie' + config,'Donut'] */,
                        /*['column'] + config, ['Barras circular']*/,
            ['pyramid', 'Piramide'],
            ['bar', 'Barras Horiz.'],
            ['spline', 'Curva'],
            ['areaspline', 'Area Curva']];
}

export function history()
{
    return [['line', 'Linea'],
            ['area', 'Area'],
            ['histogram', 'Histograma'],
            ['waterfall', 'Cascada']];
}

export function metrics()
{
    return [['solidgauge', 'Gauge'],
            ['gauge', 'Gauge'],
            ['gauge2', 'Gauge']];
}

export function special()
{
    return ["bubble"  /*3 vars, distribucion, con skater se puede*/,
            'heatmap' /*distribucion */,
            'treemap' /*composicion*/,];
}

export function toEdit()
{
    return ['scatter'/*nube de puntos, distribucion*/,
            'boxplot'/*velas*/,
            'sankey'/*raro*/,
            'variwide'/*columnas*/,
            'vector'/*mapa vectorial*/,
            'wordcloud'/*mapa palabras*/,
            'xrange' /*diag. Gant*/,
            'organization'/*arbol jerarquia*/,
                    /*'column' + config /*barras multicolor, comparacion de composiciones*/];
}

export function others()
{
    return ['sunburst'/*multi dona, jeraquia, composicion*/,
            'timeline',
            'polygon'];
}

export function evenMore()
{
    return ['bellcurve' /*areaspline*/,
            'parallel'/*raro*/,
            'funnel'/*marketing*/,
            'networkgraph'/*raro, data relationship*/];
}
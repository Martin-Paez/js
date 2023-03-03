/**
 * Crea un menu para dar como atributo menu a las opciones de inicializacion 
 * de Highcharts. 
 * 
 * Puede ser usando, por ejemplo, para dar un valor al atributo exporting del
 * atributo graph de las opciones usadas al crear un highchart.
 * 
 */
export class HChartMenu {
    constructor() {
        this.buttons = {};
        this.buttons.contextButton = {};
        this.buttons.contextButton.menuItems = [];
    }

    literalObj() {
        return { enabled: true, buttons : this.buttons };
    }
    
    add(item) {
        this.buttons.contextButton.menuItems.push(item);
    }

    addTitle(label) {
        this.add({ text: label });
    }

    addGeneric(label, handler)
    {
        this.add( { text: label, onclick: handler } );
    }

    /**
     * Agrega varios items al menu. 
     * 
     * categs es una lista de listas de Nx2. Esta pensado para usarse con 
     * las funciones tales como comparision(), history(), etc. Estas funciones
     * retornan las categorias.
     * 
     */
    addCategs(categs) 
    {
        categs.forEach( (categ, i) => {
            this.addTitle(categ[1]);
            this.addLine();
            categ[0].forEach( (type, i) => {
                this.add({ text: "- " + type[1], onclick: function(){
                    this.update({
                        chart: {
                            type: type[0]
                        },
                    });
                }});
            });
            this.addLine();
        });
    }

    /* Linea grafica que separa opciones (o grupos de opciones) del menu.
     * 
     */
    addLine() {
        this.add({ separator: true });
    }

    /* 
     * Boton que elimina un widget de un GridWidget.
     *
     * Recibe una instancia de WidgetGrid, que no es un Highchart.
     * 
     */
    addClose(widgetGrid) {
        let btn = { text: 'Cerrar', onclick: function(){
            // "this" es el highchart y "this.container" es el Hijo del nodo container
            // entregado en las opciones de Highcharts.chart('name', {container: "html"}).
            // Con WidgetGrid el container tiene id igual al titulo del chart.
            widgetGrid.removeWidget(this.container.parentNode)
        }};

        this.add(btn);
    }
    
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

    comparision() 
    {
        return [['column','Columnas'], 
                ['pie','Torta'], 
                /*['pie' + config,'Donut'] */,
                /*['column'] + config, ['Barras circular']*/, 
                ['pyramid','Piramide'],
                ['bar','Barras Horiz.']];
    }

    history() 
    {
        return [['line','Linea'], 
                ['area','Area'], 
                ['histogram', 'Histograma'],
                ['waterfall', 'Cascada'], 
                ['spline', 'Curva'], 
                ['areaspline', 'Area Curva']];
    }

    metrics() 
    {
        return [['solidgauge','Indicador simple'], 
                ['gauge', 'Indicador colores']];
    }

    special() 
    {
        return ["bubble"/*3 vars, distribucion, con skater se puede*/,
                'heatmap' /*distribucion */,
                'treemap' /*composicion*/, ];
    }

    toEdit() 
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

    others() 
    {
        return ['sunburst'/*multi dona, jeraquia, composicion*/,
                'timeline', 
                'polygon'];
    }

    evenMore() 
    {
        return ['bellcurve' /*areaspline*/, 
                'parallel'/*raro*/, 
                'funnel'/*marketing*/,
                'networkgraph'/*raro, data relationship*/];
    }

}
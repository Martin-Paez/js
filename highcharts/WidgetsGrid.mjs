import {defaultOpts} from './HighChartOpts.mjs'


/*
 * Crea un grid de widgets, los cuales pueden reminensionarse y reacomodarse con el 
 * mouse. El grid se coloca dentro del primer tag html con class="grid-stack".
 * El grid es como una cuadricula, un contenedor, dentro del cual se alojan los 
 * widgets.
 */
export class WidgetsGrid {

    constructor (rowHeight) 
    {
        this.widgets   = [];
        this.gridstack = GridStack.init({
            cellHeight: 70,
            acceptWidgets: true,
        });

        $(window).on('resize', ()=>{
            this.refresh();
        });
    }

    getGridStack() 
    {
        return this.gridstack;
    }

    addHighChart(chartOpts, {x, y, w, h}, id) 
    {
        let item = { x: x, y:y, w: w , h:h, content: `<div id="${id}"></div>`};     
        this.gridstack.addWidget(item);          
        
        let chart = Highcharts.chart(id, chartOpts); 
        
        this.initLastAdded(chart, id);

        return chart;
    }

    initLastAdded(chart, id) {
        let widget = this.lastAdded();
        this.initChartMenu(widget); 
        this.initWidget(chart, widget, id);
    }
    
    lastAdded() {
        let widgets = this.gridstack.getGridItems();
        return widgets[widgets.length-1];
    }

    initChartMenu(widget)
    {/*
        let wnode = widget.ddElement.el; 
        let q = 'g.highcharts-no-tooltip.highcharts-button.highcharts-contextbutton';
        let menuBtn = wnode.querySelector(q);

        menuBtn.addEventListener('click', function (event) {
            // highcharts-contextmenu aparece al apretar por primer vez
            // let menu = wnode.querySelector('div.highcharts-contextmenu');
            widget.childNodes[0].style.zIndex = '2000';
        });*/
    }

    // TODO Quitar data(...)

    /* Dimensiona y setea el evento resizetop de un widget.
     *
     * Recibe informacion del widget:
     *      gridItem : se puede obtener con this.gridstack.getGridItems()[x];
     *      widgetId : id que se le asigno al crear con addHighChart
     *      content  : objeto con metodo setDim(height, width). Por ejemplo, un
     *                 Highchart. 
     */
    initWidget(content, gridItem, widgetId) 
    {        
        var gridContainer = gridItem.querySelector(`#${widgetId}`);
        gridContainer.dataset['widget_index'] = this.widgets.length;
        this.widgets.push(content);

        this.setDim(gridContainer, content);
        this.gridstack.on('resizestop', (event) => {
            var gridContainer = $(event.target).find(`[data-widget_index]`)[0]; 
            let i = gridContainer.dataset['widget_index'];
            this.setDim(gridContainer, this.widgets[i]);
        });
    }

    /* Elimina un widget.
     *
     * Nota: 
     *  Al crear el widget con el metodo addHighChart() se recibe por parametro un 
     *  id. Ese id se usa para dar valor al atributo id de un tag html. Este metodo
     *  recibe como parametro ese elemento html.
     * 
     */
    removeWidget(node) 
    {
        // Lo que se elimina es un .grid-stack-item
        this.gridstack.removeWidget(node.parentNode.parentNode)
    } 

    /* Redimenciona el contenido al tamano del widget. 
     * El parametro content debe tener el metodo setSize(width, height) implementado.
     */
    setDim (widget, content) 
    {
        let width = widget.offsetWidth;
        let height = widget.parentNode.offsetHeight * 0.95;
        content.setSize(width, height);
    }

    /* Redimenciona todos los widgets al tamano del contenedor
     */
    refresh() 
    {
        self = this;
        setTimeout(function() {
            $('[data-widget_index]').each(function(index, e) {
                let i = e.dataset['widget_index'];
                self.setDim(e, self.widgets[i]);
            });
        }, 500);
    }

}

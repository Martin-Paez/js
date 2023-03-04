/*
 * Crea un grid de widgets, los cuales pueden reminensionarse y reacomodarse con el 
 * mouse. El grid se coloca dentro del primer tag html con class="grid-stack".
 * El grid es como una cuadricula, un contenedor, dentro del cual se alojan los 
 * widgets.
 */
export class WidgetsGrid {

    constructor (rowHeight, colWidth) 
    {
        this.widgets   = [];
        this.gridstack = GridStack.init({
            cellHeight: rowHeight,
            acceptWidgets: true,
            float: true,
            minRow: 10,
            resizable: {
                handles: 'all'
            },
        });

        $(window).on('resize', ()=>{
            this.refresh();
        });
    }

    getGridstack() 
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

    initLastAdded(chart, id, cols=4, rows=4) {    
        let w = this.lastAdded();

        if ($(this.gridstack.el).hasClass('grid-stack-1'))
        {
            $(window).one('resize', () => {
                this.gridstack.update(w.el, { w: 12 });
            })
        }
        this.initChartMenu(w); 
        this.initWidget(chart, w, id, cols, rows);

        $(this.gridstack.el).trigger('widget-added');
    }
    
    lastAdded() {
        let widgets = this.gridstack.getGridItems();
        return widgets[widgets.length-1];
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
    initWidget(content, gridItem, widgetId, cols=4, rows=4) 
    {   
        this.gridstack.update(gridItem, { w: cols, h: rows })
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
        let width = widget.offsetWidth * 1;
        let height = widget.parentNode.offsetHeight * 1;
        content.setSize(width, height);
    }

    /* Redimenciona todos los contenidos al tamano del widget
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
}

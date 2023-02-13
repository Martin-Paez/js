import {menuExporting, generic_chart} from './HighChartOpts.mjs'

/*
 * Crea un grid de widgets, los cuales pueden reminensionarse y reacomodarse con el 
 * mouse. El grid se coloca dentro del primer tag html con class="grid-stack".
 * El grid es como una cuadricula, un contenedor, dentro del cual se alojan los 
 * widgets.
 */
export class WidgetsGrid {
    
    constructor (rowHeight) {
        this.gridstack = GridStack.init({cellHeight: rowHeight, gridAlignment: 'bottom'});
        this._widgets = [];
        self = this;
        $(window).on('resize', function() {
            self._refresh();
        });
    }

    getGridStack() {
        return this.gridstack;
    }

    /*
     * Crea un grafico usando la libreria HighChart y agrega al grid un widget que lo
     * contiene.
     */
    addHighChart(type, px, py, w, h, sx, sy, id, title = id, yTitle = "", xTitle = "",
                buttons = null, tooltip = true, rotation = 0, colorsLabel = true) {
        return this.addHighChart2(type, px, py, w, h, sx, sy, id, {title: title,
                    yTitle: yTitle, xTitle: xTitle, tooltip: tooltip, buttons: buttons,
                    rotation: rotation, colorsLabel: colorsLabel});
    }

    addHighChart2(type, px, py, w, h, sx, sy, id, {title = id, yTitle = "", xTitle = "",
                  tooltip = true, buttons = null, rotation = 0, colorsLabel = true}) {
        let item = { x: px, y:py, w: w , h:h, content: `<div id="${id}"></div>`};     
        this.gridstack.addWidget(item);                 
        let menu = menuExporting(buttons);
        var config = generic_chart(type, sx, sy, title, yTitle, xTitle, menu, tooltip, 
                                   rotation, colorsLabel);
        let chart = Highcharts.chart(id, config); 

        let widgets = this.gridstack.getGridItems();
        let widget = widgets[widgets.length-1];
        //let menuOpen = menu.buttons.contextButton.onclick;
        let wnode = widget.ddElement.el; 
        /* Se probaron :
         *  'g.highcharts-exporting-group'); , es el mas externo
         *  'rect.highcharts-button-box" , es el mas profundo
         *  'button.highcharts-a11y-proxy-button.highcharts-no-tooltip' , lo da chrome devtools
         *   
         * Pero el que funciona es el siguiente: */ 
        let menuBtn = wnode.querySelector('g.highcharts-no-tooltip.highcharts-button.highcharts-contextbutton');
        //let resizeBtn = wnode.querySelector('div.ui-resizable-handle.ui-resizable-se');
        menuBtn.addEventListener('click', function (event) {
            // highcharts-contextmenu aparece despues de apretar el boton la primer vez
            //let menuContainer = wnode.querySelector('div.highcharts-contextmenu');
            widget.childNodes[0].style.zIndex = '2000';
        });
        

        
        this._initWidget(chart, id);
    }

    // TODO Quitar data(...)

    /* Dimensiona y setea el evento resizetop de un widget.
     *
     * Recibe informacion del widget:
     *      widgetId: Atributo id del html.
     *      content: objeto con metodo setDim(height, width). Por ejemplo, un
     *               Highchart. 
     */
    _initWidget(content, widgetId) {        
        var gridContainer = $(`#${widgetId}`)[0];
        gridContainer.dataset['widget_index'] = this._widgets.length;
        this._widgets.push(content);
        this._setDim(gridContainer, content);
        var self = this;
        this.gridstack.on('resizestop', function(event) {
            var gridContainer = $(event.target).find(`[data-widget_index]`)[0]; 
            let i = gridContainer.dataset['widget_index'];
            self._setDim(gridContainer, self._widgets[i]);
        });
    }

    /* Elimina un widget.
     *
     * Recibe por parametro el elemento html cuyo id es igual al titulo del grafico.
     * Dicho elemento se encuentra dentro de un .grid-stack.
     */
    removeWidget(widget_id_equals_chart_title) {
        // Lo que se elimina es un .grid-stack-item
        this.gridstack.removeWidget(widget_id_equals_chart_title.parentNode.parentNode)
    } 

    /* Redimenciona el contenido al tamano del widget
     */
    _setDim (widget, content) {
        let width = widget.offsetWidth;
        let height = widget.parentNode.offsetHeight * 0.95;
        content.setSize(width, height);
    }

    /* Redimenciona todos los widgets al tamano del contenedor
     */
    _refresh() {
        self = this;
        setTimeout(function() {
            $('[data-widget_index]').each(function(index, e) {
                let i = e.dataset['widget_index'];
                self._setDim(e, self._widgets[i]);
            });
        }, 500);
    }

}
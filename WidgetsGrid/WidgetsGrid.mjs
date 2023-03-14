import { EventMgr } from './EventMgr.mjs';

/*
 * Crea un grid de widgets, los cuales pueden reminensionarse y reacomodarse con el 
 * mouse. El grid se coloca dentro del primer tag html con class="grid-stack".
 * El grid es como una cuadricula, un contenedor, dentro del cual se alojan los 
 * widgets.
 * 
 * Cada elemento de grid es un grid-item. Y dentro de el hay widgets, que son lo
 * que el usuario desea ver, redimenzionar y desplazar.
 */
export class WidgetsGrid 
{
    /**  
     * @param {js obj} defaultOpts
     *   Opciones por defecto de cada grid-item que se anada
     * @param {px} rowHeight 
     *  Altura de cada fila del grid
     */
    constructor(defaultOpts = { w: 4, h: 4 }, rowHeight = 58) 
    {
        this.widgets      = [];
        this._handlers    = {};
        this._eventMgr    = new EventMgr();
        this._defaultOpts = defaultOpts;
        this.gridstack    = GridStack.init({
            cellHeight: rowHeight,
            acceptWidgets: true,
            float: true,
            minRow: 11,
            resizable: {
                handles: 'all'
            },
        });

        $(window).on('resize', (e) =>
        {
            if (e.target === window)
                this.refresh();
        });
    }

    /**
     * Agrega un evento al html del gridstack
     * 
     * Eventos destacados:
     *      'added' : luego con el metodo lastAdded se recupera el '.grid-stak-item'.
     *      'widget-for-remove' : event.target tiene el '.grid-stak-item'. 
     * 
     * @param {*} event 
     * @param {*} callback 
     */
    on(event, callback)
    {
        this._eventMgr.on(event, callback);
        this.gridstack.on(event, () => {
            this._eventMgr.emit(event);
        });
    }

    /**
     * Elimina un evento del html del gridstack
     * 
     * Eventos destacados:
     *      'added' : luego con el metodo lastAdded se recupera el '.grid-stak-item'.
     *      'widget-for-remove' : event.target tiene el '.grid-stak-item'. 
     * 
     * @param {*} event 
     * @param {*} callback 
     */
    off(event, callback)
    {
        this._eventMgr.off(event, callback);
        this.gridstack.off(event, callback);
    }

    /**
     * Agrega un nuevo item y dentro coloca un Highchart
     * 
     * @param {*} chartOpts 
     *  Opciones highchart
     * @param {*} param1 
     *  Opciones del grid-item
     * @param {*} id 
     *  id html del padre del html del widget y descentiende del nuevo grid-item 
     * @returns 
     *  highchart object
     */
    addHighChart(chartOpts, { x, y, w, h }, id) 
    {
        let item = { x: x, y: y, w: w, h: h, content: `<div id="${id}"></div>` };
        this.gridstack.addWidget(item);

        let chart = Highcharts.chart(id, chartOpts);

        this.initLastAdded(chart, id);

        return chart;
    }

    /**
     * Inicializa el ultimo widget anadido al grid. 
     * 
     * Es util separar este comportamiento para reutilizar con los widget anadidos
     * usando drag and drop.
     * 
     * @param {*} widget
     *  Contenido del grid item 
     * @param {*} id 
     *  Id del grid item
     */
    initLastAdded(widget, id)
    {
        let gitem = this.lastAdded();
        
        this._smallScreenSepUp(gitem);
        this._initChartMenu(gitem);
        this._autoFitContent(widget, gitem, id);
    }

    /**
     * Grid-stack dispone en vertical y con igual ancho a todos los items en 
     * pantallas chicas.
     * 
     * Al cargar el grid en una ventana chica, todos los widget que se agregen 
     * van a tiener una columna de ancho. Luego se agranda la pantalla y el 
     * item que ocupaba todo el ancho pasa a ser muy chico. 
     * 
     * Este metodo asegura que al agrandar la pantalla los widget creados en las
     * condiciones mencionadas tengan como ancho el valor establecido por
     * default. Ese valor se inicializa en el constructor (this._defaultOpts.w).
     * 
     * @param {node html} gitem 
     *  Item que se va a inicializar
     */
    _smallScreenSepUp(gitem) 
    {
        if ($(this.gridstack.el).hasClass('grid-stack-1') &&
            this._defaultOpts.w !== undefined)
        {   
            $(window).one('resize', (e) =>
            {   // En small screen los nuevos widgets tienen una sola columana 
                if (e.target === window)
                    this.gridstack.update(gitem.el, { w: this._defaultOpts.w  });
            })
        }
    }

    /**
     * Retorna el ultimo widget agregado al grid.
     * 
     * @returns div.grid-item
     */
    lastAdded()
    {
        let items = this.gridstack.getGridItems();
        return items[items.length - 1];
    }

    // TODO Quitar data(...)
    /**
     * Ajusta el contenido, o sea el widget, al tamano del contenedor. Ademas
     * se repetira el proceso cuando se remiensione el grid-item (contenedor).  
     *
     * Recibe informacion del widget:
     *      gitem : se puede obtener con this.gridstack.getGridItems()[x];
     *      widgetId : id html del widget (hijo de grid-item-content)
     *      widget  : objeto con metodo setSize(height, width). Por ejemplo, un
     *                 Highchart. 
     */
    _autoFitContent(widget, gitem, widgetId) 
    {
        this.gridstack.update(gitem, this._defaultOpts);
        var gridContainer = gitem.querySelector(`#${widgetId}`);
        gridContainer.dataset['widget_index'] = this.widgets.length;
        this.widgets.push(widget);

        this._fitContent(gridContainer, widget);
        this.gridstack.on('resizestop', (event) =>
        {
            var gridContainer = $(event.target).find(`[data-widget_index]`)[0];
            let i = gridContainer.dataset['widget_index'];
            this._fitContent(gridContainer, this.widgets[i]);
        });
    }

    resizeWidget(gitem, cols, rows) 
    {
        this.gridstack.update(gitem, { w: cols, h: rows });
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
        $(node).trigger('widget-for-remove');
        this.gridstack.removeWidget(node.parentNode.parentNode);
    }

    /** 
     * Redimenciona el contenido (widget en si mismo) al tamano del contenedor (widget
     * para gridstack, o sea, lo que se redimenciona, arrastra y contiene aquello que 
     * el usuario quiere que sea el widget). 
     * 
     * @param { nodo html } widgetHtml
     *  Nodo Html , nieto de grid-item eh hijo de grid-item-content. Es el html del 
     *  widget que el usuario agrego al grid-item.  
     * 
     * @param { widgetDelUsuario } widgetObj
     *  Debe tener el metodo setSize(width, height) implementado. Sera redimencionado 
     *  con ese metodo al tamano del contenedor.
     */
    _fitContent(widgetHtml, widgetObj) 
    {
        let width = widgetHtml.offsetWidth * 1;
        let height = widgetHtml.parentNode.offsetHeight * 1;
        widgetObj.setSize(width, height);
    }

    /**
     * Redimenciona el contenido, o sea el widget, al tamano del grid-item.
     */
    refresh() 
    {
        setTimeout(() =>
        {
            let a = $('[data-widget_index]');
            $('[data-widget_index]').each((index, e) =>
            {
                let i = e.dataset['widget_index'];
                this._fitContent(e, this.widgets[i]);
            });
        }, 500);
    }

    _initChartMenu(widget)
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

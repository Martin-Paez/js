import { genericChart } from './opts-hchart.mjs';
import { IModel  } from "./IModel.mjs";
import { getCssVar } from './cssAnimate.mjs';

export class GraphCatalog extends IModel
{
    constructor(categs, grid, graph={title , units, opts, source}, id="")
    {
        super(graph);

        this._id     = id;
        this._categs = categs;
        this._grid   = grid;
        this._charts = {};
        this._count  = 0;
    }

    reload() 
    {/*
        for (let chart in this._charts) { 
            chart = this._charts[chart];
            let serie = this._model.source().y(0,this._model.n);
            chart.series[0].setData(serie[0].data, false);
            chart.redraw(true);
        }*/
        for (let key in this._charts)
            this._charts[key].reflow(); // Adaptar size al contenedor 
        this._emit('loaded');
    }

    modelName() {
        return this._categs.name;
    }

    load($pane) 
    {
        this._categs.list.forEach(chartType => {
            this._restock($pane, chartType);
        });
        this.reload($pane);
    }

    _restock($pane, chartType) 
    {
        let id    = this._id + "-" + chartType[0] + "-" + ++this._count;
        let item  = this._getHtmlWidget(id, chartType);        
        let chart = this._model.createChart(chartType[0]);  
        chart.title.text = chartType[1];
        
        $pane.append(item);

        this._setUpWindowChart(chart);
        this._charts[id] = Highcharts.chart(id, chart);

        setTimeout(()=> {
            GridStack.setupDragIn('.newWidget');
        }, 500); // Para que los reemplazos sean dragables sin cerrar la ventana

        let $item = $pane.children().last().find('.dynamicLoad'); 
        
        let widgetAdded = () => {
            this._grid.off('added', widgetAdded); 
            $item.off('mousedown');
            $item.off('mousedown');
            this._setUpGridChart($pane, $(this._grid.lastAdded()));
        };
        $item.on('mousedown', () => 
        {
            this._grid.on('added', widgetAdded);
        });
        $item.on('mouseup', () => 
        {   // Se si solto fuera de la ventana este evento no se ejecuta
            this._grid.off('added', widgetAdded);
        });
    }

    _setUpGridChart($pane, $widget) {
        let $item   = $widget.find('.dynamicLoad');
        let id      = $item.attr('id');
        let chart   = this._charts[id];
        let type    = [];
        
        type.push($item.data('type'));
        type.push($item.data('type-label'));

        // TODO : quitar valores hardcodeados
        let opts = { 
            chart: { margin      : 40    ,
                     marginRight : 40    ,
                     marginTop   : 50    ,
                     backgroundColor : getCssVar('--chart-bg-ww'), },
            yAxis: { visible     : true },
            title: { text        : this._model.title() },
            exporting: { enabled : true },            
        }
        if(chart.options.xAxis)
            opts.xAxis = { visible  : true };
        if(chart.options.chart.type === 'gauge' || chart.options.chart.type === 'solidgauge')
            opts.pane = { size : '180%' };
        chart.update(opts);

        delete this._charts[id];
        
        this._grid.initLastAdded(chart, id);
        this._grid.resizeWidget(this._model.gridCols(), this._model.gridRows());
        this._restock($pane, type); //Repongo widget en catalogo
    }

    _setUpWindowChart(chart) {
        chart.chart.margin        = 10;
        chart.chart.marginTop     = 30;
        chart.exporting.enabled   = false;
        chart.chart.backgroundColor = 'transparent';
        if (chart.xAxis) {
            chart.xAxis.visible   = false;
            chart.yAxis.visible   = false;
        }
        if(chart.chart.type === 'gauge' || chart.chart.type === 'solidgauge')
            chart.pane.size = '140%';
    }

    _getHtmlWidget(id, type) 
    {
        return `<div class="newWidget grid-stack-item"> 
                    <div class="grid-stack-item-content">
                        <div class="dynamicLoad" id="${id}" data-type="${type[0]}" data-type-label="${type[1]}">
                        </div>
                    </div>
                </div>`;
    }
}
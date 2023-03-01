import { genericChart} from './HighChartOpts.mjs';
import { IModel } from "./IModel.mjs";

export class GraphCatalog extends IModel 
{
    constructor(id, chartTypes, grid, graph={title , units, opts, source}) 
    {
        super(graph);

        this._id     = id;
        this._types  = chartTypes;
        this._grid   = grid;
        this._charts = {};
        this._count  = 0;
    }

    animateCatalog() 
    {
        for (let chart in this._charts) { 
            chart = this._charts[chart];
            let serie = this._model.source().y(0,this._model.n);
            chart.series[0].setData(serie[0].data, false);
            chart.redraw(true);
        }
    }

    load($pane) 
    {
        this._types.forEach(chartType => {
            this._createWidget($pane, chartType);
        });
        this._grid.getGridstack().on('added', () => {
            this._setUpGridChart($pane);
        });
        this.load = this._animateGraphs;
    }

    _createWidget($pane, chartType) 
    {
        let id    = this._id + "-" + chartType[0] + "-" + ++this._count;
        let item  = this._getHtmlWidget(id, chartType);        
        let chart = genericChart(chartType[0], this._model);  
        chart.title.text = chartType[1];
        
        $pane.append(item);
        this._setUpWindowChart(chart);
        this._charts[id] = Highcharts.chart(id, chart);
        setTimeout(()=> {
            GridStack.setupDragIn('.newWidget');
        }, 500); // Para que los reemplazos sean dragables sin cerrar la ventana 
    }

    _setUpGridChart($pane) {
        let widget = $(this._grid.lastAdded())
        let $item  = widget.find('.dynamicLoad');
        let id     = $item.attr('id');
        let chart  = this._charts[id];
        let type   = [];
        
        type.push($item.data('type'));
        type.push($item.data('label'));
        chart.update({ 
            xAxis: { visible : true  },
            yAxis: { visible : true  },
            title: { text    : this._model.title() },
        });
        this._grid.initLastAdded(chart, id);
        //this._gris.update();  evita escondidos al soltar en el grid sin sombra

        this._createWidget($pane, type); //Reemplazo en window
    }

    _setUpWindowChart(chart) {
        chart.chart.width = 300;
        chart.chart.height = 200;
        chart.xAxis.visible = false;
        chart.yAxis.visible = false;
    }

    _getHtmlWidget(id, type) 
    {
        return `<div class="newWidget grid-stack-item"> 
                    <div class="grid-stack-item-content">
                        <div class="dynamicLoad" id="${id}" data-type="${type[0]}" data-label="${type[1]}">
                        </div>
                    </div>
                </div>`;
    }
}
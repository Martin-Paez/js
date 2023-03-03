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
    {/*
        for (let chart in this._charts) { 
            chart = this._charts[chart];
            let serie = this._model.source().y(0,this._model.n);
            chart.series[0].setData(serie[0].data, false);
            chart.redraw(true);
        }*/
    }

    load($pane) 
    {
        this._types.forEach(chartType => {
            this._restock($pane, chartType);
        });
        this._grid.getGridstack().on('added', () => {
            this._setUpGridChart($pane);
        });
        this.load = this.animateCatalog;
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
    }

    _setUpGridChart($pane) {
        let widget  = $(this._grid.lastAdded())
        let $item   = widget.find('.dynamicLoad');
        let id      = $item.attr('id');
        let chart   = this._charts[id];
        let type    = [];

        type.push($item.data('type'));
        type.push($item.data('type-label'));
        chart.update({ 
            chart: { margin   : 40    ,
                     marginTop: 50   },
            xAxis: { visible  : true },
            yAxis: { visible  : true },
            title: { text     : this._model.title() },
        });
        this._grid.initLastAdded(chart, id, this._model.gridCols(), this._model.gridRows());
    
        this._restock($pane, type); //Repongo widget en catalogo
    }

    _setUpWindowChart(chart) {
        chart.chart.margin    = 10;
        chart.chart.marginTop = 30;
        chart.yAxis.visible   = false;
        chart.xAxis.visible   = false;
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
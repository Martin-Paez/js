import { genericChart} from './HighChartOpts.mjs';
import { IModel } from "./IModel.mjs";

export class GraphCatalog extends IModel 
{
    constructor(id, types, grid, model={title , units, opts, source}) 
    {
        super(model);

        this._id     = id;
        this._types  = types;
        this._grid   = grid;
        this._charts = {};
        this._count  = 0;
    }

    load($pane, $tab) 
    {
        this._types.forEach(type => {
            this._createWidget($pane, type[0]);
        });
        this._grid.getGridstack().on('added', () => {
            this._setUpWidget();
        });
    }

    _createWidget($pane, type) 
    {
        let id    = this._id + "_" + type + "_" + ++this._count;
        let item  = this._getGridItem(id, type);
        let chart = genericChart(type, this._model);  

        $pane.append(item);
        this._setUpWindowGraph(chart);
        this._charts[id] = Highcharts.chart(id, chart);
        setTimeout(()=> {
            GridStack.setupDragIn('.newWidget');
        }, 500); // Para que los reemplazos sean dragables sin cerrar la ventana 
    }

    _setUpWidget() {
        let widget = $(this._grid.lastAdded())
        let $item  = widget.find('.dynamicLoad');
        let type   = $item.data('type');
        let id     = $item.attr('id');
        let chart  = this._charts[id];
        
        chart.update({ 
            xAxis: { visible : true },
            yAxis: { visible : true } 
        });
        this._grid.initLastAdded(chart, id);
        //this._gris.update();  evita escondidos al soltar en el grid sin sombra

        this._createWidget($pane, type); //Reemplazo en window
    }

    _setUpWindowGraph(chart) {
        chart.chart.width = 300;
        chart.chart.height = 200;
        chart.xAxis.visible = false;
        chart.yAxis.visible = false;
    }

    _getGridItem(id, item) 
    {
        return `<div class="newWidget grid-stack-item"> 
                    <div class="grid-stack-item-content">
                        <div class="dynamicLoad" id="${id} data-type="${type}">
                        </div>
                    </div>
                </div>`;
    }
}
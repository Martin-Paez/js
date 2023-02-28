import { genericChart, defaultOpts} from './HighChartOpts.mjs';
import { TabWinController } from "./TabsWinController.mjs";
import { HChartMenu } from '../highcharts/HChartMenu.mjs';
import { IModel } from "./IModel.mjs";

class GraphModel extends IModel 
{
    constructor(id, types, grid, model={title , units, opts, source}) 
    {
        super(model);

        this.id     = id;
        this.types  = types;
        this.grid   = grid;
        this.charts = {};
        this.count  = 0;
    }

    load($pane, $tab) 
    {
        if(this.count>0)
            return;  

        this.types.forEach(type => {
            this.createWidget($pane, type[0]);
        });
        this.grid.gridstack.on('added', () => {
            this.setUpWidget();
        });
    }

    createWidget($pane, type) 
    {
        let id    = this.id + "_" + type + "_" + ++this.count;
        let item  = this.getGridItem(id, type);
        let chart = genericChart(type, this.model);  

        $pane.append(item);
        this.setUpWindowGraph(chart);
        this.charts[id] = Highcharts.chart(id, chart);
        setTimeout(()=> {
            GridStack.setupDragIn('.newWidget');
        }, 500); // Para que los reemplazos sean dragables sin cerrar la ventana 
    }

    setUpWidget() {
        let widget = $(this.grid.lastAdded())
        let $item  = widget.find('.dynamicLoad');
        let type   = $item.data('type');
        let id     = $item.attr('id');
        let chart  = this.charts[id];
        
        chart.update({ 
            xAxis: { visible : true },
            yAxis: { visible : true } 
        });
        this.grid.initLastAdded(chart, id);
        this.gris.update(); // evita escondidos al soltar en el grid sin sombra

        this.createWidget($pane, type); //Reemplazo en window
    }

    setUpWindpwGraph(chart) {
        chart.chart.width = 300;
        chart.chart.height = 200;
        chart.xAxis.visible = false;
        chart.yAxis.visible = false;
    }

    getGridItem(id, item) 
    {
        return `<div class="newWidget grid-stack-item"> 
                    <div class="grid-stack-item-content">
                        <div class="dynamicLoad" id="${id} data-type="${type}">
                        </div>
                    </div>
                </div>`;
    }
}

import { WidgetsGrid } from './WidgetsGrid.mjs'
import { IotMenu } from './IotMenu.mjs';
/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    let sx = [ '9/2/2023 10:05:00', '9/2/2023 10:10:00', '9/2/2023 10:15:00' ];
    let sy = [{ name: 'Temperatura', data: [49, 55, 106.4] }];

    let rowHeight = 300;
    let  grid = new WidgetsGrid(rowHeight);
    
    let opts = defaultOpts();
    opts.menu = new IotMenu(grid).literalObj();
    
    let chart = genericChart('line', sx, sy, 'Humedad', '[%]', opts);
    grid.addHighChart(chart, {x:8, y:0, w:4, h:4}, 'Humedad');

    let categs = new HChartMenu();
    opts = {
        title  : 'Humedad',
        units  : '[%]',
        opts   : defaultOpts(),
        source : { x: ()=>{return [ '1', '2', '3' ]}, 
                   y: ()=>{return [{ name: 'Humedad', data: [49, 55, 106.4] }] }}
    };
    let models = { 
        dbw_hist: new GraphModel('dbw_hist', categs.history()    , opts, grid), 
        dbw_met : new GraphModel('dbw_met' , categs.metrics()    , opts, grid), 
        dbw_comp: new GraphModel('dbw_comp', categs.comparision(), opts, grid)
    };

    let window = new TabWinController(models);

    window.addOpenBtn('#open');
});

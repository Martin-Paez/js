import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog }     from './GraphCatalog.mjs';
import { GraphFactory }     from "../../highcharts/HighChartOpts.mjs";
import { GaugeFactory }     from "../../highcharts/HighChartOpts.mjs";
import { WidgetsGrid }      from "../../highcharts/WidgetsGrid.mjs";
import { HChartMenu }       from './HChartMenu.mjs';

/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    let categs    = new HChartMenu();
    let rowHeight = 70;/*window.innerHeight * (1/8);*/
    let  grid     = new WidgetsGrid(rowHeight);
    let source    = {
        x: ()=>{return [ '1', '2', '3' ]}, 
        y: ()=>{return [{ name: 'Humedad', data: [49, 55, 106.4] }] }
    };
    let graph  = new GraphFactory(source, 3, "Humedad", '[%]');
    let gauge  = new GaugeFactory(source, "Humedad", '[%]');
    let models = { 
        dbw_hist: new GraphCatalog('dbw-hist', categs.history()    , grid, graph), 
        dbw_met : new GraphCatalog('dbw-met' , categs.metrics()    , grid, gauge), 
        dbw_comp: new GraphCatalog('dbw-comp', categs.comparision(), grid, graph)
    };

    let window = new TabWinController(models);

    window.addOpenBtn('.open-widget');
});

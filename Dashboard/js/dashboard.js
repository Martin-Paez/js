import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog }     from './GraphCatalog.mjs';
import { WidgetsGrid }      from "../../highcharts/WidgetsGrid.mjs";
import { HChartMenu }       from './HChartMenu.mjs';
import { IotMenu }          from "../../highcharts/IotMenu.mjs";
import { Graph }            from "../../highcharts/HighChartOpts.mjs";

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
    let graph  = new Graph(source, 3, "Humedad", '[%]');
    let models = { 
        dbw_hist: new GraphCatalog('dbw-hist', categs.history()    , grid, graph), 
        dbw_met : new GraphCatalog('dbw-met' , categs.metrics()    , grid, graph), 
        dbw_comp: new GraphCatalog('dbw-comp', categs.comparision(), grid, graph)
    };

    let window = new TabWinController(models);

    window.addOpenBtn('.open-widget');
});

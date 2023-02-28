import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog }     from './GraphCatalog.mjs';
import { defaultOpts}       from './HighChartOpts.mjs';
import { HChartMenu }       from '../highcharts/HChartMenu.mjs';

/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    let categs = new HChartMenu();
    opts = {
        title  : 'Humedad',
        units  : '[%]',
        opts   : defaultOpts(),
        source : { x: ()=>{return [ '1', '2', '3' ]}, 
                   y: ()=>{return [{ name: 'Humedad', data: [49, 55, 106.4] }] }}
    };
    let models = { 
        dbw_hist: new GraphCatalog('dbw_hist', categs.history()    , opts, grid), 
        dbw_met : new GraphCatalog('dbw_met' , categs.metrics()    , opts, grid), 
        dbw_comp: new GraphCatalog('dbw_comp', categs.comparision(), opts, grid)
    };

    let window = new TabWinController(models);

    window.addOpenBtn('#open');
});

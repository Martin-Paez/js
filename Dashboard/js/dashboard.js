import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog     } from './GraphCatalog.mjs';
import { GraphFactory     } from "./GraphFactory.mjs";
import { GaugeFactory     } from "./GaugeFactory.mjs";
import { listLikeTabs     } from './listLikeTabs.mjs';
import { WidgetsGrid      } from "./WidgetsGrid.mjs";
import { toggleSame       } from './toggleFamily.mjs';
import { comparision      } from "./categ-hchart.mjs";
import { WebWindow        } from "./WebWindow.mjs";   
import { metrics          } from "./categ-hchart.mjs";
import { history          } from "./categ-hchart.mjs"; 
/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    
    // Fuente de datos
    let source    = {
        x: ()=>{return [ '1', '2', '3' ]}, 
        y: ()=>{return [{ name: 'Humedad', data: [80, 55, 90.4] }] }
    };

    // Grid
    let grid = new WidgetsGrid();

    // Graficos
    let opts = GraphFactory.defaultOpts(function()
    {
        grid.removeWidget(this.container.parentNode)
    });
    let configBtn = '<i class="chartConfigBtn bi-gear"></i>';
    GraphFactory.addBtn(opts, configBtn, 'chartConfig', function(){alert(1)});

    let graph  = new GraphFactory(source, 3, "Humedad", '%', opts);
    let gauge  = new GaugeFactory(source, "Humedad", '%', opts);
 
    // Ventana
    let models = { 
        dbw_hist : new GraphCatalog('dbw-hist', history()    , grid, graph), 
        dbw_met  : new GraphCatalog('dbw-met' , metrics()    , grid, gauge), 
        dbw_comp : new GraphCatalog('dbw-comp', comparision(), grid, graph),
    };
    let ctgw = new TabWinController(models, 'catalog-window');
    ctgw.addOpenBtn('.open-widget');
    toggleSame(grid.getGridstack(), ctgw.isOpen.bind(ctgw), ctgw.hide.bind(ctgw),
               ctgw.show.bind(ctgw), 'dragstart', 'dragstop');
    
    let chartConfig = new WebWindow('chart-window');
    chartConfig.setDefaultCloseBtn();
    $(grid.getGridstack().el).on('widget-added', (e) => {
        let $widget = $(e.target);
        let $btn = $widget.find(".chartConfigBtn");
        chartConfig.addOpenBtn($btn); 
    });
});

// chart-config form
document.addEventListener('DOMContentLoaded', function() 
{
    let $source = $('#source-1b');
    
    $source.find('.protocol').on('change', (e) => {
        listLikeTabs(e, 'protocol', $source);
    });

    $source.find('.source-name input').on('change', function() 
    {
        let a = $(this).val();
        $('#source-1h .accordion-button').html($(this).val())
    });

    $source.find('.sources-list').on('change', (e) => {
        listLikeTabs(e, 'sources-list', $source);
    });

});
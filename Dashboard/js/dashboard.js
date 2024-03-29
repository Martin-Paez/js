import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog     } from './GraphCatalog.mjs';
import { GraphFactory     } from "./GraphFactory.mjs";
import { GaugeFactory     } from "./GaugeFactory.mjs";
import { listLikeTabs     } from './listLikeTabs.mjs';
import { WidgetsGrid      } from "./WidgetsGrid.mjs";
import { toggleSame       } from './toggleFamily.mjs';
import { comparision      } from "./categ-hchart.mjs";
import { ChartConfig      } from "./ChartConfig.mjs";
import { WebWindow        } from './WebWindow.mjs';
import { metrics          } from "./categ-hchart.mjs";
import { history          } from "./categ-hchart.mjs"; 
/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    
    // Grid
    let grid = new WidgetsGrid({w:3, h:4});
    
    // Fuente de datos
    let source    = {
        x: ()=>{return [ '1', '2', '3' ]}, 
        y: ()=>{return [{ name: 'Humedad', data: [80, 55, 90.4] }] }
    };

    // Configuracion general de los graficos
    let opts = GraphFactory.defaultOpts(function()
    {
        grid.removeWidget(this.container.parentNode);
    }, 'color: var(--open-widget-color)');

    let chartConf = new ChartConfig();
    
    let selSource = new WebWindow('#select-source', chartConf);
    selSource.setDefaultCloseBtn(); 
    
    let configTab = { cw_sources : chartConf };
    let cconfw    = new TabWinController(configTab, '#chart-window');
    cconfw.setDefaultCloseBtn();
    
    let configBtn = '<i style="color: var(--open-widget-color)" class="chartConfigBtn bi-gear"></i>';
    GraphFactory.mergeBtn(opts, configBtn, 'chartConfigBtn', (chart) => {
        let $btn = $(configBtn);
        cconfw.addOpenBtn($btn, chart.renderTo.getAttribute('id'));
    });

    // Fabricas para graficos
    let graph  = new GraphFactory(source, 3, "Humedad", '%', opts);
    let gauge  = new GaugeFactory(source, "Humedad", '%', opts);
 
    // Ventana para catalogo de graficos
    let catalogs = { 
        dbw_hist : new GraphCatalog(history()    , grid, graph), 
        dbw_met  : new GraphCatalog(metrics()    , grid, gauge), 
        dbw_comp : new GraphCatalog(comparision(), grid, graph),
    };
    let ctgw = new TabWinController(catalogs, '#catalog-window');
    ctgw.addOpenWidget('.open-widget', '#open');

    // Vinculo grid/ventana. Se oculta al mover widgets
    hideWindowOnWidgetDrag(grid, ctgw);
    hideWindowOnWidgetDrag(grid, selSource);
    hideWindowOnWidgetDrag(grid, cconfw);
});

function hideWindowOnWidgetDrag(grid, WebWindow)
{
    let isOpen = WebWindow.isOpen.bind(WebWindow);
    let hide   = WebWindow.hide.bind(WebWindow);
    let show   = WebWindow.show.bind(WebWindow);
    toggleSame( grid, isOpen, hide, show, 'dragstart', 'dragstop');
}

// chart-config form
document.addEventListener('DOMContentLoaded', function() 
{
    let $source = $('#select-source');

    // Elegir fuente / crear nueva fuente 
    $source.find('.sources-list').on('change', (e) => {
        listLikeTabs(e, 'sources-list', $source);
    });

    // Titulo del acordion = nombre de la fuente
    $source.find('.source-name input').on('change', function() 
    {
        let a = $(this).val();
        $('#source-1h .accordion-button').html($(this).val())
    });

    // Mostrar opciones acordes al protocolo
    $source.find('.protocol').on('change', (e) => {
        listLikeTabs(e, 'protocol', $source);
    });
});

// Imprimir texto en pestana notas de la ventana. Util para debug.
export function printf(msg) {
    $('textarea').html($('textarea').html() + msg);
    $('textarea').scrollTop($('textarea')[0].scrollHeight - $('textarea').height());
}
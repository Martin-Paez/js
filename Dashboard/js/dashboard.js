import { TabWinController } from "./TabsWinController.mjs";
import { GraphCatalog }     from './GraphCatalog.mjs';
import { GraphFactory }     from "./HighChartOpts.mjs";
import { GaugeFactory }     from "./HighChartOpts.mjs";
import { WidgetsGrid }      from "./WidgetsGrid.mjs";
import { HChartMenu }       from './HChartMenu.mjs';
import { toggleSame }       from './toggleFamily.mjs';
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
    let opts = GraphFactory.defaultOpts(function()
    {
        grid.removeWidget(this.container.parentNode)
    });

    let graph  = new GraphFactory(source, 3, "Humedad", '[%]', opts);
    let gauge  = new GaugeFactory(source, "Humedad", '[%]', opts);

    let models = { 
        dbw_hist: new GraphCatalog('dbw-hist', categs.history()    , grid, graph), 
        dbw_met : new GraphCatalog('dbw-met' , categs.metrics()    , grid, gauge), 
        dbw_comp: new GraphCatalog('dbw-comp', categs.comparision(), grid, graph)
    };

    let tw = new TabWinController(models);
    
    $(grid.getGridstack().el).on('widget-added', (e) => {
        toggleSame(e.target, tw.isOpen.bind(tw), tw.hide.bind(tw), tw.show.bind(tw));
    });

    tw.addOpenBtn('.open-widget');
});

document.addEventListener('DOMContentLoaded', function() 
{
    let $source = $('#source_1b');
    $source.find('.protocol').on('change', function() 
    {    
        let $this = $(this);
        let $panes = $source.find(`.sel-content`);
        let $pane = $panes.find(`.sel-pane[id=${$this.val()}]`);
        if($pane.hasClass('hide')) 
        {    
            $pane.closest('.sel-content').find(' > :not(hide)').addClass('hide');
            $pane.removeClass('hide');
        }
    });

    $source.find('.source-name input').on('change', function() {
        let a = $(this).val();
        $('#source_1h .accordion-button').html($(this).val())
    });

});
import * as hco from './HighChartOpts.mjs';
import {WidgetsGrid} from './WidgetsGrid.mjs'

/*
 * NO uso load porque no hay ningun elemento (como una imagen) en el html
 * que genere ese evento. Si lo hubiera deberia usar load, porque 
 * DOMContentLoaded podria generar el evento antes de disponer del recurso.
 */
document.addEventListener("DOMContentLoaded", function() {
    let sx = [ '9/2/2023 10:05:00', '9/2/2023 10:10:00', '9/2/2023 10:15:00' ];
    let sy = [{ name: 'Temperatura', data: [49, 55, 106.4] }];

    let  grid = new WidgetsGrid(window.innerHeight * (1/8));
    
    let buttons = hco.chartsButtonList();
    buttons.push(hco.menuSeparatorLine());
    buttons.push(hco.showTableBtn(grid));
    buttons.push(hco.closeBtn(grid));
    let opts = { yTitle:'[ºC]', /*rotation: -45,*/ colorsLabel: false,
                 buttons: buttons };

    grid.addHighChart2('line', /*x*/8, /*y*/0, /*w*/4, /*h*/4, sx, sy, 'Humedad', opts);
    grid.addHighChart2('column', 8, 4, 4, 4, sx, sy, 'Luminancia', opts);

    let column = JSON.parse(JSON.stringify(sy[0]));  // Deep copy
    // Variacion aletarea, de a multiplos de 10
    column.data = column.data.map(x => x + (Math.random() - 0.5) * 100); 
    column.type = 'column';
    sy.unshift(column);           // unshift() y no push(), se muestran por detras 
    
    column = { ... sy[sy.length-1] };       // Shallow copy
    column.type = 'column';
    sy.unshift(column);

    let pie = { 
        type : 'pie',
        name: sy[0].name,
        data: [ {name:'Dth11'   , y: 10, color: '#b2ffff'} ,
                {name:'Generico', y: 150, color:'#FFA500'} , 
                {name:'Dht22'   , y: 50, color: '#800080'} ] ,
        // Uso % para que sea responsivo
        center: ['15%', '15%'], 
        size: '20%',            
        innerSize: '70%',
        showInLegend: false,
        dataLabels: { enabled: true },
    };
    sy.unshift(pie);

    grid.addHighChart2('line', 0, 0, 8, 8, sx, sy, 'Temperatura', opts);
    
});


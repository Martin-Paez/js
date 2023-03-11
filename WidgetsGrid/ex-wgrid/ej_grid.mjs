import { genericChart, speedometer, defaultOpts} from './opts-hchart.mjs';
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

    let rowHeight = window.innerHeight * (1/8);
    let  grid = new WidgetsGrid(rowHeight);
    
    let opts = defaultOpts();
    opts.menu = new IotMenu(grid).literalObj();
    
    let chart = genericChart('line', sx, sy, 'Humedad', '[%]', opts);
    grid.addHighChart(chart, {x:8, y:0, w:4, h:4}, 'Humedad');

    chart = speedometer(50, 'Luminancia', '[Lux]', opts);
    grid.addHighChart(chart, {x:8, y:4, w:4, h:4}, 'Lux');

    
    
    let column = JSON.parse(JSON.stringify(sy[0]));  // Deep copy
    // Variacion aleatorea de a multiplos de 10
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
        size: '25%',            
        innerSize: '60%',
        showInLegend: false,
        dataLabels: { enabled: true },
    };
    sy.unshift(pie);

    chart = genericChart('line', sx, sy, 'Temperatura', '[ºC]', opts);
    grid.addHighChart(chart, {x:0, y:0, w:8, h:8}, 'Temp');

    
});


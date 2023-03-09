import { HChartMenu  } from "./HChartMenu.mjs";
import { comparision } from "./categ-hchart.mjs";
import { metrics     } from "./categ-hchart.mjs";
import { history     } from "./categ-hchart.mjs";

export class IotMenu extends HChartMenu 
{
    constructor(widgetGrid) {
        super();
        let categs  = [ [metrics(), 'METRICAS'], 
                        [history(), 'HISTORIAL'],
                        [comparision(), 'COMPARACION']];
        this.addCategs(categs);
        this.addClose(widgetGrid);
    }

    // Hay Otros pra IoT : 
    // Radar: no es un tipo, si no un modo de configuracion con Polar: true
    // 'windbarb': direccion y velosidad del viento
    // 'windrose': para el viento
    // 'errorbar': sobre un grafico cada puntos tiene rangos de error
    
}
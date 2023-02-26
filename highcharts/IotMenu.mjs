import { HChartMenu } from "./HChartMenu.mjs";

export class IotMenu extends HChartMenu 
{
    constructor(widgetGrid) {
        super();
        let categs  = [ [this.metrics(), 'METRICAS'], 
                        [this.history(), 'HISTORIAL'],
                        [this.comparision(), 'COMPARACION']];
        this.addCategs(categs);
        this.addClose(widgetGrid);
    }

    // Hay Otros pra IoT : 
    // Radar: no es un tipo, si no un modo de configuracion con Polar: true
    // 'windbarb': direccion y velosidad del viento
    // 'windrose': para el viento
    // 'errorbar': sobre un grafico cada puntos tiene rangos de error
    
}
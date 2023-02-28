/**
 * Sirve para cargar el contenido de las pestanas de boostrap.
 * 
 * Para un nav-tab y nav-content de bootstrap particulares. Carga el contenido
 * de cada tab-pane. 
 * 
 */
export class TabsController {
    /**
     * @param {query} navTabsQ 
     *  Contenedor de los tab-item ('.nav-tab').
     * 
     * @param {query} tabContentQ 
     *  Contenedor de los tab-pane ('.nav-content').
     * 
     * @param {js object} modelList 
     *  Es un objeto js cuyos nombres de atributo deben coincidir con cada 
     *  data-bs-target de los nav-link (se ignora el primer caracter, porque 
     *  suele ser un #). Cada uno de dichos atributos debe guardar un TabModel.
     */
    constructor(navTabsQ, tabContentQ, models, prevCalls = [], nextCalls = []) 
    {
        this._models = models;
        this._prev   = prevCalls;
        this._next   = nextCalls;
        this._$links = $(navTabsQ).find('.nav-link');
        this._$panes = $(tabContentQ);

        this.initEvents();
    }

    isNotLoaded() 
    {
        return this._active === undefined;
    }
    
    load() 
    {
        this._load(this._findActive());
    }

    // Ante un click pide al modelo que cargue los datos en el tab-pane adecuado.
    initEvents() 
    {
        self = this;
        this._$links.on('click', (e) => {
            this._prev.forEach( (f)=>{f($(e.target));} );
            this._load($(e.target));
            this._next.forEach( (f)=>{f($(e.target));} );
        });
    }

    _load($tab) 
    {
        this._active = $tab;
        let paneId = this._active.data('bs-target').slice(1);
        let model = this._models[paneId];
        let $pane = this._$panes.find(`[id=${paneId}]`);
        model.load($pane, $tab);
    }

    _findActive() 
    {
        return this._$links.filter(function () {
            return $(this).hasClass('active');
        });
    }
}
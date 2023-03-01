/**
 * Sirve para cargar el contenido de las pestanas de boostrap.
 * 
 * Carga el contenido de cada tab-pane dados un nav-tab y nav-content de bootstrap.
 * 
 */
export class TabsController {
    /**
     * Si hay alguna pestana .active se carga el tab-pane al instanciar la clase. Si
     * hay varias solo queda activa la primera.
     * 
     * @param {query} navTabsQ 
     *  Contenedor de los tab-item ('.nav-tab').
     * 
     * @param {query} tabContentQ 
     *  Contenedor de los tab-pane ('.nav-content').
     * 
     * @param {js object} paneModels 
     *  Es un objeto js cuyos nombres de atributo deben coincidir con cada 
     *  data-bs-target de los nav-link (se ignora el primer caracter, porque 
     *  suele ser un #). Cada uno de dichos atributos debe guardar un IModel
     *  que tiene el contenido del pane target.
     * 
     * @param {list} prevCalls
     *  Lista de callbacks llamados antes de cargar datos en el pane 
     * 
     * @param {list} nextCalls
     *  Lista de callbacks llamados despues de cargar datos en el pane 
     */
    constructor(navTabsQ, tabContentQ, paneModels, prevCalls = [], nextCalls = []) 
    {
        this._models = paneModels;
        this._prev   = prevCalls;
        this._next   = nextCalls;
        this._$links = $(navTabsQ).find('.nav-link');
        this._$panes = $(tabContentQ);

        this.initEvents();
        this._findActive().trigger('click');
    }

    // Setea onclick a cada pestana cargar los tab-pane bajo demanda por UNICA vez.
    initEvents() 
    {
        this._$links.one('click', (e) => {
            this._load($(e.target));
        });
    }

    _load($tab) 
    {
        this._prev.forEach( (f)=>{f($(e.target));} );
            
        let job = (model, $pane, $tab) => {  
            model.load($pane, $tab); 
        };
        this._paneJob($tab, job); 

        this._next.forEach( (f)=>{f($(e.target));} );
    }

    reload() {
        let job = (model, $pane, $tab) => {  
            model.animateCatalog(); 
        };
        this._paneJob(this._active, job);
    }

    /**
     * Carga el pane de una pestana.
     * 
     * @param {jQuery} $tab 
     *  Pestana cuyo contenido ah de ser cargado.
     */
    _paneJob($tab, job) 
    {
        this._active = $tab;
        let paneId = this._active.data('bs-target').slice(1);
        let model = this._models[paneId];
        let $pane = this._$panes.find(`[id=${paneId}]`);
        job(model, $pane, $tab);
    }

    // Encuentra la pestana activa. Si hay varias solo deja activa la primera.
    _findActive() 
    {
        let active = this._$links.filter(function () {
            return $(this).hasClass('active');
        });
        
        if(active.lenght > 1) {
            active.removeClass('active');
            active = $(active[0]);
        }

        return active;
    }
}
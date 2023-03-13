import { IController } from "./IController.mjs";

/**
 * Sirve para cargar el contenido de las pestanas de boostrap.
 * 
 * Carga el contenido de cada tab-pane dados un nav-tab y nav-content de bootstrap.
 * 
 */
export class TabsController extends IController {
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
    constructor(navTabsQ, tabContentQ, paneModels) 
    {
        super(paneModels, `${tabContentQ} > *`);

        this._initElems(navTabsQ);
        
        this._active = this._findActive();
    }

    // Setea onclick a cada pestana cargar los tab-pane bajo demanda por UNICA vez.
    _initElems(navTabsQ) 
    {
        this._$links = $(`${navTabsQ} .nav-link`);

        this._$links.on('click', (e) => {
            this._loadModel($(e.currentTarget));
        });
    }

    modelName() 
    {
        let paneId = this._active.data('bs-target').slice(1);
        let model = this._model[paneId];
        return model.modelName();
    }

    load() 
    {
        this._active.trigger('click');
    }

    /**
     * Carga el pane de una pestana.
     * 
     * @param {jQuery} $tab 
     *  Pestana cuyo contenido ah de ser cargado.
     */
    _loadModel($tab) 
    {
        this._active = $tab;
        let paneId = this._active.data('bs-target').slice(1);
        super.load($tab, paneId);
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
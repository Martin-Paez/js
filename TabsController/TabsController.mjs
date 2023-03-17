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

        this._initElems($(`${navTabsQ} .nav-link`));
    }

    // Setea onclick a cada pestana cargar los tab-pane bajo demanda por UNICA vez.
    _initElems($tabs) 
    {   $tabs.each( (i, btn) => {
            let $btn = $(btn);
            if ( $btn.hasClass('active') )
                if (this._active !== undefined)
                    $btn.removeClass('active');
                else
                    this._$active = $btn;
            this.addOpenBtn(this._targetId($btn), $btn);
        });
    }

    _targetId($tab)
    {
        return $tab.data('bs-target').slice(1);
    }

    load(id, $btn, ...args) 
    {   
        if(! $btn)
            this._$active.trigger('click');
        else
        {
            this._$active = $btn;
            super.load(id, $btn, ...args);
        }
    }

    reload(model, $box, $btn, ...args)
    {
        this._$active = $btn;
        super.reload(model, $box, $btn, ...args)
    }

    modelName()
    {
        let id = this._targetId(this._$active);
        return this._model[id].modelName();
    }

}

/*
_findActive() 
    {
        let active = this._$tabs.filter(function () {
            return $(this).hasClass('active');
        });
        
        if(active.lenght > 1) {
            active.removeClass('active');
            active = $(active[0]);
        }

        return active;
    }
*/
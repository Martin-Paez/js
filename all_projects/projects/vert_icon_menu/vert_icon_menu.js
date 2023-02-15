/**
 * Este es un modo simple y eficiente de manejar botons que ocultan y muestran.
 * 
 * Pensado para el evento onclick en los tag html. Implica colocar js embebido y no
 * permite usar el archivo como modulo js. Sin embargo, es un muy simple eh intuitivo.
 * 
 * Ademas, se puede usar desde js, sin embeber codigo.
 * 
 * Es la eficiente, no es necesario recorrer el DOM.
 *
 * Es versatil, la sintaxis css permite listar varios elementos.
 * 
 * @example
 *      
 * <button id="show" onclick="switchDsp('#show, .sc','#hide') > Mostrar </button>
 * 
 * <buttom id="hide" onclick="switchDsp(this, '#show, .sc') > Mostrar </button>
 * 
 * <div class="sc"> 
 *      Contenido 
 * </div>
 * 
 * 
 *  Quedaria aun mas compacto usando .sc en vez de #show
 * 
 * @end
 * 
 * @example
 *      
 * let show = document.getElementById("#show");
 * let hide = document.getElementById("#hide");
 * switchDsp(show, hide);
 * 
 * Enviar objetos es valido, ya que se usa JQuery: $(show) = $('#showId')
 * 
 * @end
 * 
 * @param { JQuerySelector }  hide Elementos que se van a ocultar
 * @param { JQuerySelector }  show Elementos que se van mostrar
 * @param { DisplayAttr }  dsp Display de css para los elementos de show
 */
function switchDsp(hide, show, dsp = 'block') {
    $(hide).css('display', 'none');
    $(show).css('display', dsp);
}

/**
 * Es una version de switchDsp mas simple para un subconjunto de los problemas.
 * 
 * El elemento que se clickea debe ser hijo de aquel que se oculta. 
 *  
 * @example
 * <button id="undoBtn" onclick="undoHide('#menu')" > Mostrar </button>
 * 
 * <div id="menu"> 
 *      <buttom id="hide" onclick="hdieParent('#undoBtn') > 
 *              Mostrar 
 *      </button>
 *      Contenido 
 * </div>
 * @end
 * 
 * Mas compacto, se podria asignar .sc en vez de #show
 *
 * @param { JQuerySelector } undoBtn Elementos que se van a mostrar. Si se desea, luego,
 *                                   se puede configurar un boton usando undoHide().
 * @param { DisplayAttr } dsp Valor del atributo Display de css para los elementos de show
 */
function hideParent(undoBtn, dsp = 'block') {
    switchDsp(this.parentNode, undoBtn, dsp);
}

/**
 * Pensada para usarse en conjunto con hudeParent. 
 * 
 * La idea es ocultar el boton que llamo a la funcion y mostrar los elementos sow
 * 
 * @param {JQuerySelector} show Elementos que se van a mostrar
 * @param {DisplayAttr} dsp Valor del atributo Display de css para los elementos show
 */
function undoHide(show, dsp = 'block') {
    switchDsp(this, show, dsp);
}

/**
 * Otra version de switchDsp para cuando ambos usan el mismo valor de display
 * distinto de block. Se intercambia el valor de Display css entre hide y show
 * 
 * @param {JQuerySelector} hide Elementos que se van a ocultar
 * @param {DisplayAttr} show Elementos que se van mostrar
 */
function swapDsp(hide, show) {
    hide = $(hide);
    let dsp = hide.attr('display');
    hide.css('display', 'none');
    $(show).css('display', dsp);
}

// Los menues deben tener un id seteado

/*  
 *
 */

const _DEBUG_VIM = true;

var _vimenu         =   '.VIMenu';
var _list           =   '.nav-pills';
var _item           =   '.item-VIM';

var _iconBtn        =   '.link-VIM';  
var _activeBtn      =   `${_iconBtn}.active`;
var _expandedContent=   '.expanded-content-VIM';
var _expSubBtn      =   '.expanded-sub-btn-VIM';
var _contractBtns   =   '.contract-VIM'
var _expandBtns     =   '.expand-VIM';
var _hideBtn        =   '.hide-VIM';
var _showBtn        =   '.show-VIM';
var _target         =   'target-VIM';

var urlAttr         =   'load-url-VIM';

/* Elegi alinear el codigo de un modo diferente como para probar. Me parece mas limpio
 *
 */

class VIMenu {
 
    defaultAction = {   
                        f        :  (x)     => {}            ,
                        many     :  (x)     => {return  x; } ,
                        one      :  (x)     => {return  x; } ,
                        zero     :  ( )     => {return []; } ,
                        warnMany :  (n,e)   => {console.warn(`Hay ${n} ${e}`);  } ,
                        warnZero :  (e)     => {console.warn(`No existe ${e}`); } 
                    }

    constructor() {

        let m       =   {};
        let self    =   this;
        this.menus  =   {}
        let menues  =   $(_vimenu);

        menues.each(function(i, menu) {
            menu = $(menu)[0];
            self.initMenus(menu);
            self.initNavBtns(menu.id);
        })

        $(`[${urlAttr}]`).each(function(i, e) {
            let file = $(this).attr(urlAttr);
            e.onclick = function() { self.loadVIMPage(file, this); };
        });

    }

    initMenus(menu) {

        let action      =   this.defaultAction;
        action.warnMany =   (n,e) => {};
        let expContent  =   this.initTargetIdBtns   (menu,  _expandedContent, action);

        let hideBtns    =   this.initTargetIdBtns   (menu,  _hideBtn        );
        let expandBtns  =   this.initTargetIdBtns   (menu,  _expandBtns     );
        let contractBtns=   this.initTargetIdBtns   (menu,  _contractBtns   );
        let showBtns    =   this.initTargetAttrBtns (menu,  _showBtn        );
        let activeBtn   =   this._initActiveBtn     (menu                   );
        let expSubBtn   =   this._setActiveExpSubBtn(menu, activeBtn        );

        this.menus[menu.id]                 =   {}
        this.menus[menu.id]['menu']         =   menu;
        this.menus[menu.id]['active']       =   activeBtn;
        this.menus[menu.id]['expContent']   =   expContent;
        this.menus[menu.id]['contractBtns'] =   contractBtns;
        this.menus[menu.id]['showBtns']     =   showBtns;
        this.menus[menu.id]['hideBtns']     =   hideBtns;
        this.menus[menu.id]['expandBtns']   =   expandBtns;
        
    }

    initNavBtns(menuId) {

        let m           =   this.menus[menuId];
        let expContent  =   $(m.expContent).add($(m.contractBtns));

        $(m.showBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.showBtns, m.menu) };
        });
        $(m.hideBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.menu, m.showBtns) };
        });
        $(m.expandBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.expandBtns, expContent) };
        });
        $(m.contractBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(expContent, m.expandBtns) };
        });

    }

    singleMode() {

        let many = (x) => { return x[0]; };

        return    { zero    : () => { return null; }    , 
                    many    : many                      ,
                    one     : many                      ,
                    f       : (x) => {}                 ,
                    warnMany: (n,e)   => {console.warn(`Hay ${n} ${e}`);  } ,
                    warnZero: (e)     => {console.warn(`No existe ${e}`); } };
    }

    _initActiveBtn(menu) {

        let actions     = this.singleMode();
        actions.many    = (x) => {  $(x).removeClass('active rounded-0'); 
                                    return x[0];                        };
        actions.f       = (x) => {  $(x).addClass('active rounded-0');  };

        return this.initTargetIdBtns(menu, _activeBtn, actions);

    }

    _setActiveExpSubBtn(menu, activeBtn) {

        if(activeBtn === null) {
            console.warn(`No hay ${_activeBtn} en ${menu.id} `);
            return null;
        }

        let menuItem = $(activeBtn.closest(_item));
        if(menuItem.length === 0) {
            console.warn(`${activeBtn} no es hijo de un ${_item}`);
            return null;
        }

        let action  =   this.defaultAction;
        action.f    =   (x) => { $(x).addClass('active rounded-0')  };

        return this.tagJob(menuItem.find(_expSubBtn), action);
    }

    initDescendantBtns(ancestor, type, { f, many, one, zero, warnMany, warnZero } = this.defaultAction ) {

        type = $(ancestor).find($(type));
        return this.tagJob(type, { f, many, one, zero, warnMany, warnZero });

    }

    // TODO `#${target.id}` === `target` ???
    initTargetIdBtns(target, type, { f, many, one, zero, warnMany, warnZero } = this.defaultAction ) {

        return this.tagJob(`#${target.id} ${type}`, { f, many, one, zero, warnMany, warnZero });

    }

    initTargetAttrBtns(target, type, { f, many, one, zero, warnMany, warnZero } = this.defaultAction ) {

        return this.tagJob(`${type}[${_target} = ${target.id}]`, { f, many, one, zero, warnMany, warnZero });
        
    }

    tagJob( type,  { f,  many, one, zero, warnMany, warnZero } = this.defaultAction) {

        let b = $(type);

        if (b.length == 0) {
            warnZero(b);
            b = zero();

        } else if (b.length > 1) {
            warnMany(b.length,b);
            b = many(b);
        } else
            b = one(b);

        f(b);

        return b;

    }

    // Para cambiar de pagina al apretar un boton
    loadVIMPage(file, button) {
        let obj = document.getElementById('webpage_content');
        obj.data = file;
        this.setActiveBtn(button);
    }

    setActiveBtn(button){
        let menu = $(button.closest(_vimenu))[0];
        if(this.menus[menu.id].active !== null)
            this.menus[menu.id].active.classList.remove('active', 'rounded-0');
        if(this.menus[menu.id].expContent.length > 0) {
            let expSubBtn = this.menus[menu.id].expContent.find(_expSubBtn);
            expSubBtn.removeClass('active rounded-0');
        }
        button.classList.add('active', 'rounded-0');
        this.menus[menu.id].active = button;

        let menuItem = $(button.closest(_item));
        if(menuItem.length === 0) {
            console.warn(`${btn} no es hijo de un ${_item}`);
            return;
        }
        let expContent  = this.tagJob(menuItem.find(_expandedContent));
        this.menus[menu.id].expContent = expContent;
        let bigBtn = $(expContent).find(_expSubBtn);
        if(bigBtn.length > 0)
            $(bigBtn).addClass('active rounded-0');
    }
}


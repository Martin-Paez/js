/**
 * Oculta un elemento usando display none y muestra otro.
 * 
 * Este es un modo simple y eficiente de manejar botons que ocultan y muestran. Esta
 * pensado para el evento onclick en los tag html. 
 * 
 * @example
 *      
 * <button id="show" onclick="switchDsp('#show','#container') > Mostrar </button>
 * 
 * <div id="container"> 
 *      <buttom id="hide" onclick="switchDsp('#container', '#show') > Mostrar </button>
 *      Contenido 
 * </div>
 * 
 *  Quedaria aun mas compacto usando .sc en vez de #show
 * 
 * @end
 * 
 * Implica colocar js embebido y no
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
 * Oculta al padre del elemento cuyo onclick sea esta funcion. Ademas muestra
 * un boton para hacerlo visible nuevamente.
 * 
 * Es una version de switchDsp que, para un subconjunto de los problemas, resulta
 * mas simple. 
 *  
 * @example
 * <button id="undoBtn" onclick="undoHide('#menu')" > Mostrar </button>
 * 
 * <div id="menu"> 
 *      <buttom id="hide" onclick="hideParent('#undoBtn') > 
 *              Mostrar 
 *      </button>
 *      Contenido 
 * </div>
 * @end
 * 
 * La funcion undoHide es util para trabajar en conjunto con esta.
 *
 * @param { JQuerySelector } undoBtn Elementos que se van a mostrar. Si se desea, luego,
 *                                   se puede configurar un boton usando undoHide().
 * @param { DisplayAttr } dsp Valor del atributo Display de css para los elementos de show
 */

function hideParent(undoBtn, dsp = 'block') {

    switchDsp(this.parentNode, undoBtn, dsp);

}


/**
 * Pensada para usarse en conjunto con hideParent. 
 * 
 * Oculta el elemento cuyo onclick sea esta funcion y muestra el contenido recibido por
 * parametro.
 * 
 * @example
 * <button id="undoBtn" onclick="undoHide('#menu')" > Mostrar </button>
 * 
 * <div id="menu"> 
 *      <buttom id="hide" onclick="hideParent('#undoBtn') > 
 *              Mostrar 
 *      </button>
 *      Contenido 
 * </div>
 * @end
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

    hide    = $(hide);
    let dsp = hide.attr('display');

    hide.css('display', 'none');
    $(show).css('display', dsp);

}


// Los menues deben tener un id seteado


const _DEBUG_VIM        = true;

var _vimenu             =   '.VIMenu';
var _list               =   '.nav-pills';
var _item               =   '.item-VIM';

var _iconBtn            =   '.link-VIM';  
var _activeBtn          =   `${_iconBtn}.active`;
var _expandedContent    =   '.expanded-content-VIM';
var _expandedTitle      =   '.expanded-title-VIM';
var _contractBtns       =   '.contract-VIM'
var _extendBtns         =   '.extend-VIM';
var _hideBtn            =   '.hide-VIM';
var _showBtn            =   '.show-VIM';
var _target             =   'target-VIM';

var urlAttr             =   'load-url-VIM';


/* Elegi alinear el codigo de un modo diferente como para probar. Me parece mas limpio
 *
 */

class VIMenu {
 

    defaultAction = {   
        f        :  (x)     => {},
        many     :  (x)     => {return  x; },
        one      :  (x)     => {return  x; },
        zero     :  ( )     => {return []; },
        warnMany :  (n,e)   => {console.warn(`Hay ${n} ${e}`);  },
        warnZero :  (e)     => {console.warn(`No existe ${e}`); } 
    }


    constructor() {

        let self    =   this;
        this.menus  =   {}
        let menues  =   $(_vimenu);

        menues.each(function(i, menu) {
            menu = $(menu)[0];
            self.createBtns(menu);
            self.initActions(menu.id);
        })

        this.initLinks();

    }

    createBtns(menu) {

        let action      =   this.defaultAction;
        action.warnMany =   (n,e) => {};

        let activeBtn    =   this.initActiveBtn(menu);
        let showBtns     =   this.getByAttr(_showBtn, menu.id);
        let hideBtns     =   this.getByParentId(menu, _hideBtn);
        let extendBtns   =   this.getByParentId(menu, _extendBtns);
        let contractBtns =   this.getByParentId(menu, _contractBtns);
        let expContent   =   this.getByParentId(menu, _expandedContent, action);
        let expTitle     =   this.initActiveExpandedBtn(menu, activeBtn);

        this.menus[menu.id]                 =   {}
        this.menus[menu.id]['menu']         =   menu;
        this.menus[menu.id]['active']       =   activeBtn;
        this.menus[menu.id]['expContent']   =   expContent;
        this.menus[menu.id]['contractBtns'] =   contractBtns;
        this.menus[menu.id]['showBtns']     =   showBtns;
        this.menus[menu.id]['hideBtns']     =   hideBtns;
        this.menus[menu.id]['extendBtns']   =   extendBtns;
        
    }


    initActions(menuId) {

        let m           =   this.menus[menuId];
        let expContent  =   $(m.expContent).add($(m.contractBtns));

        $(m.showBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.showBtns, m.menu) };
        });
        $(m.hideBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.menu, m.showBtns) };
        });
        $(m.extendBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(m.extendBtns, expContent) };
        });
        $(m.contractBtns).each(function(i, e) {
            e.onclick = function() { switchDsp(expContent, m.extendBtns) };
        });

    }

    initLinks() {

        self = this;

        $(`[${urlAttr}]`).each(function(i, e) {
            let file = $(this).attr(urlAttr);
            e.onclick = function() { self.loadVIMPage(file, this); };
        });

    }

    singleMode() {

        let many = (x) => { return x[0]; };

        return {zero    : () => { return null; }, 
                many    : many,
                one     : many,
                f       : (x) => {},
                warnMany: (n,e)   => {console.warn(`Hay ${n} ${e}`);  } ,
                warnZero: (e)     => {console.warn(`No existe ${e}`); } };

    }


    initActiveBtn(menu) {

        let actions     = this.singleMode();
        actions.many    = (x) => {  $(x).removeClass('active rounded-0'); 
                                    return x[0];                        };
        actions.f       = (x) => {  $(x).addClass('active rounded-0');  };

        return this.getByParentId(menu, _activeBtn, actions);

    }


    initActiveExpandedBtn(menu, activeBtn) {

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

        return this.tagJob(menuItem.find(_expandedTitle), action);
    }

    
    getByParentId(parentQuery, descendantQuery, action = this.defaultAction) {
            
        let query = this.byParentId(parentQuery, descendantQuery);
        return this.tagJob(query, action);

    }


    getByAttr(query, attrValue, action = this.defaultAction) {

        query = this.byAttr(query, _target, attrValue);
        return this.tagJob(query, action);

    }


    byParentId(parentQuery, descendantQuery) {
        return `#${parentQuery.id} ${descendantQuery}`;
    }
    
    byAttr(query, attrName, attrValue){
        return `${query}[${attrName} = ${attrValue}]`;
    }


    tagJob( query,  { f,  many, one, zero, warnMany, warnZero } = this.defaultAction) {

        let b = $(query);

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
            let expandedTitle = this.menus[menu.id].expContent.find(_expandedTitle);
            expandedTitle.removeClass('active rounded-0');
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
        let bigBtn = $(expContent).find(_expandedTitle);
        if(bigBtn.length > 0)
            $(bigBtn).addClass('active rounded-0');
    }
}


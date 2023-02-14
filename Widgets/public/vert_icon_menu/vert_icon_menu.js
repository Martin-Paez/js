
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
 * Ejemplo de uso :
 * 
 *      <button id="show" onclick="switchDsp('#show, .sc','#hide') > Mostrar </button>
 * 
 *      <buttom id="hide" onclick="switchDsp(this, '#show, .sc') > Mostrar </button>
 * 
 *      <div class="sc"> 
 *          Contenido 
 *      </div>
 * 
 * 
 *      Quedaria aun mas compacto usando .sc en vez de #show
 * 
 * 
 * Ejemplo de uso:
 * 
 *      let show = document.getElementById("#show");
 *      let hide = document.getElementById("#hide");
 *      switchDsp(show, hide);
 * 
 *      Con objetos es valido, ya que se usa JQuery: $(show) = $('#showId')
 * @end
 * 
 * @param {* Selector css de elementos que se van a ocultar } hide 
 * @param {* Selector css de elementos que se van mostrar } show 
 * @param {* Valor del atributo Display de css para los elementos de show } dsp 
 */
function switchDsp(hide, show, dsp = 'block') {
    $(hide).css('display', 'none');
    $(show).css('display', dsp);
}

/**
 * El elemento que se clickea debe ser hijo de aquel que se oculta. 
 * 
 * Es una version de turnDsp mas simple para un subconjunto de los problemas.
 * 
 * Ejemplo de uso :
 * 
 *      <button id="undoBtn" onclick="undoHide('#menu')" > Mostrar </button>
 * 
 *      <div id="menu"> 
 * 
 *          <buttom id="hide" onclick="hdieParent('#undoBtn') > 
 *              Mostrar 
 *          </button>
 * 
 *          Contenido 
 * 
 *      </div>
 * 
 * 
 *      Mas compacto, se podria asignar .sc en vez de #show
 *
 * @param {* Elementos que se van a mostrar. Si se desea, luego, se puede configurar un boton usando undoHide(). } undoBtn 
 * @param {* Valor del atributo Display de css para los elementos de show } dsp 
 */
function hideParent(undoBtn, dsp = 'block') {
    switchDsp(this.parentNode, undoBtn, dsp);
}

/**
 * 
 * @param {* Elementos que se van a mostrar} show 
 * @param {*} dsp 
 */
function undoHide(show, dsp = 'block') {
    switchDsp(this, show, dsp);
}

// Otra version para cuando ambos usan el mismo valor de display distinto de block
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
var _item           =   '.nav-item';
var _activeBtn      =   '.nav-link';  

var _bigContent     =   '.big-content-IVM';
var _bigSubCnt      =   '.big-sub-cntnt-VIM';
var _contractBtn    =   '.contract-VIM'
var _expandBtns     =   '.expand-VIM';
var _hideBtn        =   '.hide-VIM';
var _showBtn        =   '.show-VIM';
var _target         =   'target-VIM';

var urlAttr         =   'load-url-VIM';

/* Elegi alinear el codigo de un modo diferente como para probar. Me parece mas limpio
 *
 */

class VIMenu {
 
    defaultAction = {   zero    :   ()  => {return []; } ,
                        many    :   (x) => {return  x; } ,
                        one     :   (x) => {return  x; } ,
                        f       :   (x) => {}            };

    constructor() {

        let m       =   {};
        let self    =   this;
        let menues  =   $(_vimenu);

        menues.each(function(i, menu) {
            menu = $(menu)[0];
            self.initMenus(menu);
            self.initNavBtns(menu.id);
            self.initLinkBtns()
        })

        $(`[${urlAttr}]`).each(function(i, e) {
            let file = $(this).attr(urlAttr);
            e.onclick = function() { self.loadVIMPage(file, this); };
        });

    }

    initMenus(menu) {

        let activeBtn   =   self._initActiveBtn     (menu,               );
        let bigContent  =   self._initBigContent    (menu,  activeBtn    );
        let contractBtn =   self.initDescendantBtns (menu,  bigContent   );
        let showBtns    =   self.initTargetAttrBtns (menu, _showBtn      );
        let hideBtns    =   self.initTargetIdBtns   (menu, _hideBtn      );
        let expandBtns  =   self.initTargetIdBtns   (menu, _expandBtns   );

        this.menus                          =   {};
        this.menus[menu.id]['active']       =   activeBtn;
        this.menus[menu.id]['bigContent']   =   bigContent;
        this.menus[menu.id]['contractBtn']  =   contractBtn;
        this.menus[menu.id]['showBtns']     =   showBtns;
        this.menus[menu.id]['hideBtns']     =   hideBtns;
        this.menus[menu.id]['expandBtns']   =   expandBtns;
        
    }

    initNavBtns(menuId) {

        let m = this.menues[menuId];

        m.showBtns.each(function(i, e) {
            e.onclick = function() { turnDsp(m.showBtns, m.menu) };
        });
        m.hideBtns.each(function(i, e) {
            e.onclick = function() { turnDsp(m.menu, m.showBtns) };
        });
        m.expandBtns.each(function(i, e) {
            e.onclick = function() { turnDsp(m.expandBtns, m.bigContent) };
        });
        m.expandBtns.each(function(i, e) {
            e.onclick = function() { turnDsp(m.expandBtns, m.bigContent) };
        });
        m.contractBtn.each(function(i, e) {
            e.onclick = function() { turnDsp(m.bigContent, m.expandBtns); };
        });

    }

    singleMode() {

        let many = (x) => { return x[0]; };

        return    { zero    : () => { return null; }    , 
                    many    : many                      ,
                    one     : many                      ,
                    f       : (x) => {}                 };
    }

    _initActiveBtn(menu) {

        let actions     = this.singleMode();
        actions.many    = (x) => {  $(x).removeClass('active rounded-0'); 
                                    return x[0];                        };
        actions.f       = (x) => {  $(x).addClass('active rounded-0');  };

        return this.initTargetIdBtns(menu, `${_activeBtn}.active`, actions);

    }

    _initBigContent(menu, btn) {

        if(btn === null)
            return this.menus[menu.id][key] = null;
            
        let menuItem = $(btn.closest(_item));
        if(menuItem.length === 0) {
            console.warn(`${btn} no es hijo de un ${_item}`);
            return this.menus[menu.id][key] = null;
        }

        let bigContent  = this.tagJob(menuItem.find(_bigContent));
        let action      = this.singleMode();
        action.many     = (x) => { x.css('background-color', '#f8f9fa')   ;
                                 return x[0];                           };
        action.f        = (x) => { $(x).css('background-color', '#0d6efd')};
        this.tagJob(bigContent.find(_bigSubCnt), action);

        return bigContent;
    }

    initDescendantBtns(ancestor, type, { zero, many, one, f } = this.defaultAction ) {

        return this.tagJob(`#${ancestor} ${type}`, {zero, many, one, f});

    }

    // TODO `#${target.id}` === `target` ???
    initTargetIdBtns(target, type, { zero, many, one, f } = this.defaultAction ) {

        return this.tagJob(`#${target.id} ${type}`, {zero, many, one, f});

    }

    initTargetAttrBtns(target, type, { zero, many, one, f } = this.defaultAction ) {

        return this.tagJob(`${type}[${_target} = ${target.id}]`, {zero, many, one, f});
        
    }

    tagJob(type, { zero, many, one, f } = this.defaultAction) {

        let b = $(type);

        if (b.length == 0) {
            console.warn(`No existe ${type}`);
            b = zero();

        } else if (b.length > 1) {
            console.warn(`Hay ${btns.length} ${type}`);
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
        if(this.activeBtn !== null)
            this.activeBtn.classList.remove('active', 'rounded-0');
        if(this.activeBigBtn !== null)
            this.activeBigBtn.style.backgroundColor = '#f8f9fa';
        button.classList.add('rounded-0', 'active');
        this.activeBtn = button;
        let bigBtn = button.parentNode.parentNode.querySelector('.big-btn-VIM');
        if(bigBtn !== null) {
            bigBtn.style.backgroundColor = '#0d6efd';
            this.activeBigBtn = bigBtn;
        };
    }
}


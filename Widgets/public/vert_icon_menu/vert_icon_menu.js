
const _DEBUG_VIM = true;

var _vimenu     =   '.VIMenu';
var _list       =   '.nav-pills';
var _item       =   '.nav-item';
var _btn        =   '.nav-link';  
var _bigBtn     =   '.big-btn-VIM'
var _showBtn    =   '.show-VIM';
var _hideBtn    =   '.hide-VIM';
var _target     =   'target-VIM';

/* Elegi alinear el codigo de un modo diferente como para probar. Me parece mas limpio
 *
 */

class VIMenu {
 
    defaultAction = { zero : () => {return null; } ,
                      many : (x)=> {return x[0]; } ,
                      one  : many                }

    constructor() {

        this.menus  =   {};
        self        =   this;

        $(_vimenu).each(function(i, menu) {

            menu                =   $(menu)[0];
            self.menus[menu.id] =   {};
            let btn             =   self._initActiveBtn(menu);
            let bigBtn          =   self._initActiveBigBtn(menu, btn);
            let showBtns        =   self._initShowBtns(menu);
            
        })

    }

    listMode() {

        let many = (x) => { return x; };
        return { zero : () => { return []; }, many: many, one: many };

    }

    initDescendentBtns(ancestor, type, { zero, many, one } = this.defaultAction ) {

        return initBtns(menu, `${ancestor} ${type}`, zero, many, one);

    }

    initTargetedBtns(target, type, { zero, many, one } = this.defaultAction ) {

        return initBtns(menu, `${type}[${_target} = ${target.id}]`, zero, many, one);
        
    }

    initBtns(menu, type, { zero, many, one } = this.defaultAction ) {

        let b = tagJob(type, zero, many, one);
        this.menus[menu.id][type.replace(/[.#]/g, '')] = b;

    }

    tagJob(type, { zero, many, one } = this.defaultAction ) {

        let b = $(type);

        if (b.length == 0) {
            console.error(`No hay existe ${type}`);
            b = zero();

        } else if (b.length > 1) {
            console.warn(`Hay ${btns.length} ${type}`);
            b = many(b);

        } else
            b = one(b);

        return b;

    }

    


    _initShowBtns(menu) {
        

        let sb = $(_showBtn);
        let btns = [];
        let i=-1;
        while(++i<sb.length) {
            let a = $(sb[i]).attr('target-VIM');
            if ($(sb[i]).attr('target-VIM') === menu.id)
                btns.push(sb[i]);}
        if (btns.length === 0)
            console.error(`No hay un ${_showBtn} cuyo atributo target-VIM sea el menu ${_vimenu}`);
        else if (btns.length > 1)
            console.error(`Warning: Se encontraron ${btns.length} tags ${_showBtn} cuyo atributo 
                          target-VIM corresponder al menu mismo menu ${_vimenu}`);
        this.menus[menu.id]['showBtn'] = btns;
        return btns;
    }

    _initActiveBtn(menu) {
        let aBtn = $(menu).find(`${_btn}.active`);
        if (aBtn.length == 0)
            return null;
        if (aBtn.length > 1) {
            console.error('Deberia haber un unico boton activo por menu');
            aBtn.removeClass('active rounded-0');
        } 
        aBtn = aBtn[0];
        $(aBtn).addClass('active rounded-0')
        this.menus[menu.id]['activeBtn'] = aBtn;
        return aBtn;
    }

    _initActiveBigBtn(menu, btn) {
        if (btn === null)
            return null;
        let container = btn.closest(_item);
        let bigBtn = $(container).find(_bigBtn);
        if (bigBtn.length === 0 )
            return null;
        if(bigBtn.length > 1) {
            console.error('Deberia haber un solo big-button (menu expandido) por cada button-icon');
            bigBtn.css('background-color', '#f8f9fa')
        }
        bigBtn = bigBtn[0];
        $(bigBtn).css('background-color', '#0d6efd')
        this.menus[menu.id]['bigBtn'] = bigBtn;
        return bigBtn;
    }

     /*   this.menuId = menuId;
        this.activeBtn = null;
        this.activeBigBtn = null;
        let menus = document.getElementById(menuId);
        let items = menus.querySelector('.nav-pills').children;
        for (let j = 0; j < items.length; j++) {
            let active = false;
            let color = '#f8f9fa';
            let btn = items[j].querySelector('.nav-link');
            if ( btn !== null && btn.classList.contains('active') ) 
                if(this.activeBtn === null && btn !== undefined ) {
                    this.activeBtn = btn;
                    color = '#0d6efd';
                    active = true;
                } else
                    btn.classList.remove('active', 'rounded-0');
            let bigBtn = items[j].querySelector('.big-btn-VIM');
            if ( bigBtn !== null && bigBtn !== undefined ) {
                bigBtn.style.backgroundColor = color;
                if(active)
                    this.activeBigBtn = bigBtn;
            }
        }

        let m  = $(`#${menuId}`);
        let sb = $(`#${showBtn}`); 
        let hb = $(`#${hideBtn}`); 
        let eb = $(`#${expandBtn}`);
        let cb = $(`#${contractBtn}`);
        let bb = $(`.${bigClass}`);

        sb.each(function(i, e) {
            e.onclick = function() { toggleDisplay(sb, m) };
        });
        hb.each(function(i, e) {
            e.onclick = function() { toggleDisplay(m , sb); };
        });
        eb.each(function(i, e) {
            e.onclick = function() { toggleDisplay(eb, bb); };
        });
        cb.each(function(i, e) {
            e.onclick = function() { toggleDisplay(bb, eb); };
        });

        self = this;
        $('[load-VIM]').each(function(i, e) {
            let file = $(this).attr('load-VIM');
            e.onclick = function() { self.loadVIMPage(file, this); };
        });
    }*/

    // Para cambiar de pagina al apretar un boton
    loadVIMPage(file, button) {
        let obj = document.getElementById('webpage_content');
        obj.data = file;
        this.setVIMBtn(button);
    }

    setVIMBtn(button){
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

function toggleDisplay(hide, show) {
    hide.css('display', 'none');
    show.css('display', 'block');
}

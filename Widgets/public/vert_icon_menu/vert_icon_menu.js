// Para cambiar de pagina al apretar un boton
function loadVIMPage(file, button, menuId) {
    let obj = document.getElementById('webpage_content');
    obj.data = file;
    setVIMBtn(button, menuId);
}

function setVIMBtn(button, menuId){
    let menus = document.getElementById(menuId);
    let buttons = menus.querySelector('.nav-pills').children;
    for (let j = 0; j < buttons.length; j++) {
        let btn = buttons[j].querySelector('.nav-link');
        if ( btn !== null )
            btn.classList.remove('active', 'rounded-0');
        let expBtn = buttons[j].querySelector('.big-btn-VIM');
        if (expBtn !== null)
            expBtn.style.backgroundColor = '#f8f9fa';
    };

    button.classList.add('rounded-0', 'active');
    let expBtn = button.parentNode.parentNode.querySelector('.big-btn-VIM');
    if(expBtn !== null)
        expBtn.style.backgroundColor = '#0d6efd';
};

function toggleDisplay(hide, show) {
    $(hide).css('display', 'none');
    $(show).css('display', 'block');
}
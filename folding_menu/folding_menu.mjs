import {toggleKin} from './toggleFamily.mjs';

document.addEventListener('DOMContentLoaded', ()=>
{   
    let menus = $('.folding-menu');

    menus.each( (i, menu) =>
    {
        menu = $(menu);
        setHideHandler(menu);
        setExpandHandler(menu);
    });
});

function setHideHandler(menu) 
{
    let show = $(`.show-btn[folding-menu=${menu.attr('id')}]`);
    let btns = menu.find('.hide-btn > i').add(show);

    btns.on('click', ()=>
    {
        menu.toggleClass('hidden');
        show.toggleClass('enable');
    });
}

export function setUpFloatOpenBtn($target, $close, $open) {
    let btns = $close.add($open);

    btns.on('click', ()=>
    {
        $target.toggleClass('hidden');
        $open.toggleClass('enable');
    });
}

function setExpandHandler(menu)
{
    let $expandLink = menu.find('.expand-btn');
    let $expandIcon = $expandLink.find('i'); 

    toggleKin($expandIcon, $expandLink, tooltips, menu);
}

function tooltips(menu) 
{
    let links       = menu.find('.folding-links');
    let span        = links.find('span');
    let toggleSpan  = (e)=>{span.toggleClass('visibleSpan');};
    
    menu.toggleClass('narrow');

    if(menu.hasClass('narrow')) 
        links.on('mouseover.foldtip mouseout.foldtip', toggleSpan);
    else
        links.off('.foldtip');
}
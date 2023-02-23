import {HoverStyleMgr} from './HoverStyleMgr.mjs';
import {ToggleList} from './ToggleList.mjs';
import {ToggledAlwaysVisibleBtns} from './ToggledAlwaysVisibleBtns.mjs';

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


function toggleKin($innerBtn, $externalBtn, callback, ...args) 
{
    let clicks  = 0;
    $innerBtn.one('click', ()=>
    {
        callback(...args);
        $externalBtn.on('click.ext-btns', ()=>
        {   
            if(++clicks > 1) {
                callback(...args);
                toggleKin($innerBtn, $externalBtn, callback, ...args);
                $externalBtn.off('.ext-btns');
            }
        });
    });
}

function toggleKinInv($externalBtn, $innerBtn, callback, ...args) 
{
    let clicks  = 0;
    $externalBtn.one('click', ()=>
    {
        callback(...args);
        $innerBtn.one('click.ext-btns', ()=>
        {   
            callback(...args);
            $externalBtn.one('click', ()=>
            {   // Filtro, esto se ejectura por ser ancestro de inner, pero el recursivo no.
                toggleKinInv($externalBtn, $innerBtn, callback, ...args);
            });
        });
    });
}

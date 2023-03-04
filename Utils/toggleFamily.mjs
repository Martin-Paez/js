export function toggleSame(targetQ, isEnabled, onMouseDown, onMouseUp) {
    let $target = $(targetQ);
    let running = false;

    $target.on('mousedown', () => {
        let a = isEnabled(); 
        if ( isEnabled() ) {
            onMouseDown();
            running = true;
        }
    });

    $target.on('mouseup', () => {
        if ( running ) {
            onMouseUp();
            running = false;
        }
    });
}

export function toggleKin($innerBtn, $externalBtn, callback, ...args) 
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

export function toggleKinInv($externalBtn, $innerBtn, callback, ...args) 
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

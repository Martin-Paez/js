export function toggleRunning(btnQuery, event, targetQuery, currClass, startClass, runClass, endClass, timer) {
    let target = $(targetQuery); 
    $(btnQuery).on(event, function(){ 
        if(currClass!==null)
            target.toggleClass(currClass);
        target.toggleClass(startClass);
        setTimeout(function(){
            target.toggleClass(runClass);
            setTimeout(function(){
                target.toggleClass(startClass);
                target.toggleClass(runClass);
                target.toggleClass(endClass);
            }, timer)
        }, 10)
    });
}
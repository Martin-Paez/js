export function listLikeTabs (event, selClass, $parent) {
    let $this = $(event.target);
    if (! $this.hasClass(selClass))
        return;
    let $panes = $parent.find(`.sel-content.${selClass}`);
    let val = $this.val();
    let $pane = $panes.find(`.sel-pane[id=${val}]`);
    if($pane.length === 0 ) {
        let b = $panes.find(' > :not(hide)');
        b.addClass('hide');
    }
    else if($pane.hasClass('hide')) 
    {    
        $panes.find(' > :not(hide)').addClass('hide');
        $pane.removeClass('hide');
    }
}
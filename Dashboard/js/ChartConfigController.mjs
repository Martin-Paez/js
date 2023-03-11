class ChartConfigController 
{
    constructor(windowId) 
    {
        this._$window = $(`#${windowId}`);
        let $add = $(this._$window.find('#add-source-btn'));

        $add.on('click', () => {
            this._createSource();
        });
    }

    _createSource() 
    {
        
    }
}
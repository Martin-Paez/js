class ImgThermWidget {
    constructor({container = '.ti_container', value = 0, height = 600, multiEvent = null,
                 imgPath = "./termometro.png"} = {}) {
        var tiContainer = document.querySelector(container);
        var barW = 11 + '%';
        var circleH = 8.5164 + '%';
        var circleW = 29.014 + '%';
        var html = '<div class="_ti_widget" style="height: ' + height + 'px;">' +
                        '<img src=' + imgPath + ' class="_ti_img">' +
                        '<div class="_ti_circle" style="width:' + circleW + ';height:' + circleH + '"></div>' +
                        '<div class="_ti_bar" style="width:' + barW + '"></div>' +    
                    '</div>'
        // NO SE PUEDE USAR innerHTML
        //      Todas las instancias apuntarian al mismo nodo, el ultimo instanciado
        const fragment = document.createRange().createContextualFragment(html);
        var widget = fragment.firstChild;
        var img = widget.firstChild;
        if (multiEvent !== null) {
            multiEvent.add(2);      // Preferible agregarlos primero
            img.addEventListener("load", () => { multiEvent.notify(); });
            document.addEventListener("DOMNodeInserted", () => { multiEvent.notify(); });
        }
        tiContainer.appendChild(widget);
        this.liquid = widget.lastChild;
        this.setTemp(value);
    }

    setTemp(value) {
        var value = parseInt(value) + 25;
        if ( value > 80.5 )
            value = 80.5;
        this.liquid.style.height = (value * 49 / 55 + 2.5 ) + "%";
    };
}

class MultiEvent {

    constructor({callback=null, eventMgr=null}) {
        this.n = 0;
        this.callback = callback;
        this.eventMgr = eventMgr;
    }

    notify() {
        if ( this.n === 0 )
            return;
        this.n -= 1;
        if (this.n ===0) {
            if (this.callback !== null)
                this.callback();
            if (this.eventMgr !== null)
                this.eventMgr.notify();
        }    
    }

    add(n) {
        this.n += n;
    }

};


class ItwResizeAndMove extends MultiEvent {
    constructor() {
        super({callback: ResizeAndMoveCallBack});
    }
}

function ResizeAndMoveCallBack() {
    var widgets = document.querySelectorAll("._ti_widget");
    widgets.forEach(function(widget) {
        widget.style.position = "absolute";
        $(widget).draggable();
        $(widget).width($(widget).find('._ti_img').width());
        $(widget).resizable({
            start: function(event, ui) {
                $(this).find('._ti_bar').hide();
                $(this).find('._ti_circle').hide();
            },
            stop: function(event, ui) {
                $(this).width($(widget).find('._ti_img').width());
                $(this).find('._ti_bar').show();
                $(this).find('._ti_circle').show();
            }
        });
    });
}
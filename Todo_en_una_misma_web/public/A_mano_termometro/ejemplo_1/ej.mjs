//import {ImgThermWidget} from './__ImgThermWidget.mjs';
import {ImgThermWidget} from './ImgThermWidget.mjs'
export var widget;

function setTemp() {
    widget.setTemp(45);
}

document.addEventListener("load", function() {
    widget = new ImgThermWidget();
    $('#set').on("click",setTemp);
});
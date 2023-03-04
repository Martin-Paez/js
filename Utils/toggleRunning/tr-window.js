import { toggleRunning } from "./toggleRunning.mjs";

document.addEventListener('DOMContentLoaded', function() {
    toggleRunning($('button'), 'click', $('.pop-window'), 'close', 'init-open', 'opening',  'open', 1000);
    toggleRunning($('.close-pop-window'), 'click', $('.pop-window'), 'open', 'init-close', 'closing', 'close', 1000);
})
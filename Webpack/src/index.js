import component from './lib.js';

const element = document.createElement('div');
element.innerHTML = 'index.js importado.';
document.body.appendChild(element);

console.log('index.js importado.');

document.addEventListener('DOMContentLoaded', function () {
  document.body.appendChild(component());
});

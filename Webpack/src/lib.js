import _ from 'lodash';

const element = document.createElement('div');
element.innerHTML = 'lib.js importado.';
document.body.appendChild(element);

console.log('lib.js importado.');

export default function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}

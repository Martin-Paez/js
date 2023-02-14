<a name="switchDsp"></a>

## switchDsp(Selector, Selector, del)
Este es un modo simple y eficiente de manejar botons que ocultan y muestran.

**Kind**: global function  
**End**:   
**End**:   

| Param | Type | Description |
| --- | --- | --- |
| Selector | <code>hide</code> | css de elementos que se van a ocultar |
| Selector | <code>show</code> | css de elementos que se van mostrar |
| del | <code>dsp</code> | atributo Display de css para los elementos de show |

**Example**  
```js
<button id="show" onclick="switchDsp('#show, .sc','#hide') > Mostrar </button>
```
**Example**  
```js
let show = document.getElementById("#show");
```
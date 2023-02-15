## Functions

<dl>
<dt><a href="#switchDsp">switchDsp(hide, show, dsp)</a></dt>
<dd><p>Este es un modo simple y eficiente de manejar botons que ocultan y muestran.</p>
<p> Pensado para el evento onclick en los tag html. Implica colocar js embebido y no
permite usar el archivo como modulo js. Sin embargo, es un muy simple eh intuitivo.</p>
<p>Ademas, se puede usar desde js, sin embeber codigo.</p>
<p>Es la eficiente, no es necesario recorrer el DOM.</p>
<p>Es versatil, la sintaxis css permite listar varios elementos.</p>
</dd>
<dt><a href="#hideParent">hideParent(undoBtn, dsp)</a></dt>
<dd><p>El elemento que se clickea debe ser hijo de aquel que se oculta. </p>
<p>Es una version de turnDsp mas simple para un subconjunto de los problemas.</p>
</dd>
<dt><a href="#undoHide">undoHide(show, dsp)</a></dt>
<dd></dd>
</dl>

<a name="switchDsp"></a>

## switchDsp(Selector, Selector, del)
Este es un modo simple y eficiente de manejar botons que ocultan y muestran.

Pensado para el evento onclick en los tag html. Implica colocar js embebido y no
permite usar el archivo como modulo js. Sin embargo, es un muy simple eh intuitivo.

Ademas, se puede usar desde js, sin embeber codigo.

Es la eficiente, no es necesario recorrer el DOM.

Es versatil, la sintaxis css permite listar varios elementos.

**Kind**: global function  
**End**:   
**End**:   

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| hide | <code>JQuerySelector</code> |  | de elementos que se van a ocultar |
| show | <code>JQuerySelector</code> |  | de elementos que se van mostrar |
| dsp | <code>DisplayAttr</code> | <code>block</code> | Display de css para los elementos de show |

**Example**  
```html
<button id="show" onclick="switchDsp('#show, .sc','#hide') > Mostrar </button>

<buttom id="hide" onclick="switchDsp(this, '#show, .sc') > Mostrar </button>

<div class="sc"> 
     Contenido 
</div>


Quedaria aun mas compacto usando .sc en vez de #show
```
**Example**  
```js
let show = document.getElementById("#show");
let hide = document.getElementById("#hide");
switchDsp(show, hide);

Enviar objetos es valido, ya que se usa JQuery: $(show) = $('#showId')
```
<a name="hideParent"></a>

## hideParent(undoBtn, dsp)
El elemento que se clickea debe ser hijo de aquel que se oculta. 

Es una version de turnDsp mas simple para un subconjunto de los problemas.

**Kind**: global function  
**End**: Mas compacto, se podria asignar .sc en vez de #show  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| undoBtn | <code>JQuerySelector</code> |  | Elementos que se van a mostrar. Si se desea, luego, se puede configurar un boton usando undoHide(). |
| dsp | <code>DisplayAttr</code> | <code>block</code> | Valor del atributo Display de css para los elementos de show |

**Example**  
```js
<button id="undoBtn" onclick="undoHide('#menu')" > Mostrar </button>

<div id="menu"> 
     <buttom id="hide" onclick="hdieParent('#undoBtn') > 
             Mostrar 
     </button>
     Contenido 
</div>
```
<a name="undoHide"></a>

## undoHide(show, dsp)
**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| show | <code>JQuerySelector</code> |  | Elementos que se van a mostrar |
| dsp | <code>DisplayAttr</code> | <code>block</code> |  |


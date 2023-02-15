var express = require('express');
var path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

var router = express.Router();

/* El proyecto es un resumen de tecnologias web, esta compuesto por ejemplos. No se penso
 * para el publico en general.
 * 
 * A su vez, cada ejemplo debe ser independiente del proyecto. O sea que, cada ejemplo es un
 * proyecto en si mismo, por lo tanto, no debe saber que esta formando parte de algo mas grande.
 * 
 * Para que sean legibles las url de los ejemplos y que no sea necesario modificar el lado del
 * servidor cuando se agregan ejemplos, se opto por que las peticiones se resuelvan mediante
 * busquedas recursivas. 
 * 
 */

function recurSearch(dir, fileName) {
  let file = null;
  try {
    fs.readdirSync(dir).forEach(f => {
        let current = path.join(dir, f);
        if (fs.statSync(current).isDirectory()) {
          var f = recurSearch(current, fileName);
          if ( f !== null)
            file = f;
        } else if (f === fileName) {
            file = current;
            return;
        }
    });
  } catch { /* no existe dir*/ }
  return file;
};

// Sirve index.html por default
router.get('/', function(req, res, next) {
  const folder = path.join(req.app.settings.root, req.app.settings.public);
  const file = recurSearch(folder, req.app.settings.index);
  res.sendFile(file);
});

/* Para cumplir con la condicion de que los ejemplos deben ser independientes, o sea, proyectos
 * simples en si mismos, la informacion de los js y css que necesitan esta dentro del html de 
 * cada ejemplo particular.
 *
 * Este middleware brinda una solucion del lado del servidor para separa el contenido del head
 * y el body, de forma tal de que el cliente pueda solicitar uno u otro a la hora de actualizar
 * con ajax el contenido de la pagina que contiene al ejemplo.
 * 
 */
router.get('/*/:tag(body|head)', function(req, res, next) {
  var reqPath = req.path.replace(/\/[^\/]+$/, "").slice(1); // le saco la primer"/" y el tag al path
  const origin = path.join(req.app.settings.root, req.app.settings.public);
  var file = recurSearch(origin, reqPath); 
  if (file !== null) {
    var tag = req.params.tag;
    file = fs.readFileSync(file);
    const $ = cheerio.load(file);
    res.send($(tag).html());
  } else
    next();
});

/* Resuelve cualquier path de manera recursiva.
 *
 * Salvo que la ruta comience con node_modules, se busca dentro de la carpeta public.
 * 
 * Ejemplo:
 * 
 *    Path : /subfolder/a.html
 * 
 *    Archivo buscado: a.html
 *    Origen de la busqueda: en app.setting.root/public/subfolder
 * 
 * Ejemplo:
 * 
 *    Path : /node_modules/subfolder/events
 * 
 *    Archivo buscado: events.js
 *    Origen de la busqueda: /node_modules/subforlder/events
 * 
 * La raiz del proyecto se encuentra en app.settings.root para desacoplar la ubicacion de este
 * archivo
 * 
 */
router.get('/*', function(req, res, next) {
  var reqPath = req.path.replace(/\/[^\/]+$/, ""); // le saco lo que hay despues de la ultima "\" (inclusive)
  var dirs = req.path.split("/");
  if (dirs[1] !== "node_modules") 
    reqPath = req.app.settings.public + reqPath;
  console.log("*****************************************");
  console.log(req.path + '\n' + reqPath + '\n' + dirs[dirs.length-1]);
  console.log("*****************************************");
  const origin = path.join(req.app.settings.root, reqPath);
  const file = recurSearch(origin, dirs[dirs.length-1]); // le saco la "/" al path
  console.log(file);
  if (file !== null)
    res.sendFile(file);
  else
    next();
});

module.exports = router;

var express = require('express');
const cheerio = require('cheerio');
var debug = require('debug')('express:server');
var path = require('path');
const fs = require('fs');
const klaw = require('klaw')
const fg = require('fast-glob');

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
async function pathSearch(query) {
  return (await fg(query))[0];
}

async function streamSearch(query) {
  return await fg.stream(query);
}

function fastGlobSearch(dir, fileName, find = pathSearch) {
  try {
    let query = path.join(path.join(dir, '**'), fileName); 
    forWindows = query.replace(/\\/g, '/');
    return find(forWindows);
  } catch (err) {
    debug(err);
    return null;
  }
}

function klawSearch(dir, fileName) {
  return new Promise((resolve, reject) => {
    const stream = klaw(dir);
    stream.on('data', item => {
      if (path.basename(item.path) === fileName) {
        resolve(item.path);
        stream.destroy();
      }
    });
    stream.on('end', () => resolve(null));
    stream.on('error', error => reject(error));
  });
}

function testSyncSearch(dir, fileName) {
  return new Promise( (resolve) => { resolve(syncSearch(dir, fileName)); });
}

function syncSearch(dir, fileName) {
  let file = null;
  try {   
    fs.readdirSync(dir).forEach(f => {
        let current = path.join(dir, f);
        if (fs.statSync(current).isDirectory()) {
          var f = syncSearch(current, fileName);
          if ( f !== null)
            file = f;
        } else if (f === fileName) {
            file = current; 
            debug(`Encontrado ${file}`);
            return;
        }
    });
  } catch(e) { debug(e) }

  return file;
};

function sendFile(filePath, res) {
  res.sendFile(filePath);
}

function searchAndServe(next, dir, fileName, req, res, okHandler = sendFile,
                        errHandler = err, searchMode = pathSearch, ... args ) {

  fastGlobSearch(dir, fileName, searchMode)
  .then( rute => {
    if (rute)
      okHandler(rute, res, ...args);
    else {
      let msg = `No se encontro el archivo`;
      errHandler(next, msg, "", req.path, dir, fileName, rute, ...args);
    }
  })
  .catch( error => {
    let msg = `Se produjo un error al buscar el archivo: error`;
    errHandler(next, msg, error, req.path, dir, fileName, rute, ...args);
  });

}


router.get('/', function(req, res, next) {
  let index = req.app.settings.index;
  let dir = req.app.settings.public;
  searchAndServe(next, dir, index, req, res);
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
router.get('/:any*/:tag(body|head)', function(req, res, next) {
  let first = req.path.split("/")[1];
  if (first === "node_modules")
    next();
  let rute = path.parse(req.path);
  rute = path.parse(rute.dir);
  rute.dir = path.join(req.app.settings.public, rute.dir);
  searchAndServe(next, rute.dir, rute.base, req, res
    , okHandler = (rute, res) => {
        rute = fs.readFile(rute, 'utf8', (err, html) => {
          let $ = cheerio.load(html);
          res.send($(req.params.tag).html());
        });
      }); 
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
  let rute = path.parse(req.path);
  let first = rute.dir.split('/')[1];
  if (first === "node_modules")
    rute.dir = path.join(req.app.settings.root, rute.dir);
  else 
    rute.dir = path.join(req.app.settings.public, rute.dir);
  searchAndServe(next, rute.dir, rute.base, req, res); 
});


function err(next, customMsg, errMsg, reqPath, searchOrigin, inFileName, outFileName) {
  debug(`***********************************************\n ` +
        `Path recibido        : "${reqPath}"            \n ` +
        `Archivo interpretado : "${inFileName}"         \n ` +
        `Origen de la busqueda: "${searchOrigin}"       \n ` +
        `Archivo encontrado   : "${outFileName}"        \n ` +
        `***********************************************   ` );
  next(new Error(customMsg + errMsg));
}

function ignoreErr(next, ...args) {
  next();
}


module.exports = router;

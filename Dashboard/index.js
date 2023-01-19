const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './A_mano_termometro/ejemplo_3/ej_uso.html'));
});

app.use(express.static('./'));

app.listen(3000, function () {});



/*const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function (req, res) {
  // Si la URL es solo "localhost:3000/" retornar index.html
  if (req.url === '/') {
    fs.readFile(/*'./A_mano_termometro/ejemplo_3'./ej_uso.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        return res.end();
      }
      // Enviar el archivo HTML como respuesta
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  } else {
      fs.readFile(req.url.slice(1), (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 Not Found');
          return res.end();
        }
        const ext = path.extname(req.url);
        if (ext === '.js')
          res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(data);
        return res.end();
      });
  } 
});
server.listen(3000);*/
  /*

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function (req, res) {
  // Si la URL es solo "localhost:3000/" retornar index.html
  if (req.url === '/') {
    fs.readFile('./dashboard.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        return res.end();
      }
      // Enviar el archivo HTML como respuesta
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
  } else {
    // Obtener la extensión del archivo solicitado
    const ext = path.extname(req.url);
    // Si la extensión es .js, retornar archivo javascript
    if (ext === '.js') {
      fs.readFile(req.url.slice(1), (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 Not Found');
          return res.end();
        }
        // Enviar el archivo JavaScript como respuesta
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.write(data);
        return res.end();
      });
    } else if (ext === '.map') {
      // Si la extensión es .map, retornar mapa de origen
      fs.readFile(req.url.slice(1), (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 Not Found');
          return res.end();
        }
        // Enviar el mapa de origen como respuesta
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        return res.end();
      });
    } else {
      // Si no es ni .js ni .map, retornar 404
      res.writeHead
      return res.end();
    };
  }
});
server.listen(3000);*/
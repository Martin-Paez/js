const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './testLibraries.html'));
});

app.use(express.static('./'));

app.listen(3000, function () {});
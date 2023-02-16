var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var indexRouter = require(`./routes/index`);

const config = require('./config');
const gitJsPath = config.gitJsPath;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('root'  , __dirname);
app.set('public', gitJsPath);
app.set('index' , 'vert_icon_menu.html');

app.use('/', indexRouter);

module.exports = app;

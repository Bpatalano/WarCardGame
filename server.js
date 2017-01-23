var express = require('express');
var path = require('path');

var app = express();

app.use('/app', express.static(path.join(__dirname, './app')));

app.use('/test', express.static(path.join(__dirname, './app')));

app.use('/test', express.static(path.join(__dirname, './test')));


var server = app.listen(3000, function(){
  console.log('Magic is happening on port 3000');
});
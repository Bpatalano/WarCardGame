var express = require('express');
var path = require('path');

var app = express();

app.use('/', express.static(path.join(__dirname, './app')));


var server = app.listen(3000, function(){
  console.log('War is being waged on port 3000');
});
var server = require('http').createServer();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));        // Static files

server.on('request', app);
 
server.listen(8050, function () {console.log('GRID ....' + server.address().port);});

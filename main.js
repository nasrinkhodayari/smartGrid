/* global __dirname */
var server = require('http').createServer();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));        // Static files

server.on('request', app);

// server.listen(8888, '192.168.88.49');
server.listen(8881, function () { console.log('Wifi ....' + server.address().port); });
// Console will print the message
console.log('Server running at http://192.168.88.49:8881/');

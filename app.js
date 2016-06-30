var express = require('express');
var items = require('./routes/items.js');
var db = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

db.connect('mongodb://localhost/adn');

app.listen(3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', items);

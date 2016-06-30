var express = require('express');
var items = require('./routes/items.js');
var db = require('mongoose');
var app = express();

db.connect('mongodb://localhost/adn');

app.listen(3000);
app.use('/', items);

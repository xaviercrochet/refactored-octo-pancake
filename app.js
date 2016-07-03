var express = require('express');
var items = require('./routes/items');
var users = require('./routes/users');
var db = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

db.connect(process.env.MONGODB_URI);

app.listen(process.env.MONGODB_PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', items);
app.use('/users', users);

var express = require('express');
var items = require('./routes/items');
var users = require('./routes/users');
var db = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

db.connect(process.env.MONGOLAB_RED_URI);

app.listen(process.env.PORT || 3000 );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())
app.use('/', items);
app.use('/users', users);

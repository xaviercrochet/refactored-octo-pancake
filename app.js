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

function allowCrossDomain(req, res, next) {
  if ('OPTIONS' == req.method) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
  }
  else {
    next();
  }
};

app.use(cors());
app.use('/', items);
app.use('/users', users);

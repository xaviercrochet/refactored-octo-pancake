var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function(req, res){
  if(!req.body.name){
    res.status(500).send("Name is empty");
  }
  else {
    User.createUser(req.body.name)
      .then(function(user){
        res.json("User successfully created");
      })
      .catch(function(err){
        // TODO: send correct http status
        res.status(404).send(err);
      })
      .done();
  }
});

module.exports = router;

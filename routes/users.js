var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

router.post('/', function(req, res){
  if(!req.body.name){
    res.status(500).send("Name is empty");
  }
  else {
    User.createUser(req.body.name)
      .then(function(user){
        res.json("User successfully created");
      })
      .catch(function(error){
        // TODO: send correct http status
        res.sendStatus(404);
      })
      .done();
  }
});

module.exports = router;

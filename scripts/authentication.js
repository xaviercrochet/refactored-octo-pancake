var express = require('express');
var User = require('../models/user');
var basicAuth = require('basic-auth');

var auth = auth

function auth(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name) {
    return unauthorized(res);
  };

  User.findByName(user.name)
    .then(function(user){
      return next();
    })
    .catch(function(err){
      return unauthorized(rez);
    })
    .done();
};
module.exports = auth;

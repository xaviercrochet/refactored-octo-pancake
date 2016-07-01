/* Adapted from https://davidbeath.com/posts/expressjs-40-basicauth.html */

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
      if(user) {
        return next();
      }
      else {
        return unauthorized(res);
      }
    })
    .catch(function(err){
      return unauthorized(res);
    })
    .done();
};
module.exports = auth;

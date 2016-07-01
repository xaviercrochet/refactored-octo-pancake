var express = require('express');
var currentUser;
var userSessionMgmt = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser
};

function getCurrentUser(){
  return currentUser;
};

function setCurrentUser(user){
  currentUser = user;
};

module.exports = userSessionMgmt;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var Item = require('./item');
var q = require('q');

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.statics.createUser = createUser;
UserSchema.statics.getUserByName = getUserByName;
UserSchema.statics.getUserById = getUserById;

UserSchema.methods.vote = vote


// check vote uniqueness here?!?
function vote(itemId){
  var userId = this._id;
  var d = q.defer();
  Item.getItemById(itemId)
    .then(function(item){
      return item.addVote(userId);
    })
    .then(function(item){
      d.resolve(item);
    })
    .catch(function(err){
      console.error(err);
      d.reject(err);
    })
    .done();
  return d.promise;
}

function getUserByName(name){
  var d = q.defer();
  User.findOne({name: name}, function(err, user){
    if(err) {
      console.error(err);
      d.reject(err);
    }
    else {
      d.resolve(user);
    }
  })
  return d.promise;
}

function createUser(name){
  var user = new User({name: name});
  var d = q.defer();
  user.save(function(err, user){
    if(err) {
      console.error(err);
      d.reject(err);
    }
    else {
      d.resolve(user);
    }
  });
  return d.promise;
}

function getUserById(id){
  var d = q.defer();
  User.findById(id, function(err, user){
    if(err){
      d.reject(err);
    }
    else {
      d.resolve(user);
    }
  });
  return d.promise;
};

UserSchema.plugin(uniqueValidator);
User = mongoose.model('User', UserSchema);
module.exports = User;

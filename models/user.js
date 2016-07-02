var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var Vote = require('./vote');
var Item = require('./item');
var q = require('q');

var UserSchema = new Schema({
  name: {type: String, required: true, unique: true}
});

UserSchema.statics.createUser = createUser;
UserSchema.statics.getUserByName = getUserByName;
UserSchema.statics.getUserById = getUserById;

UserSchema.methods.vote = vote


// check vote uniqueness here?!?
function vote(itemId){
  var userId = this._id;
  var d = q.defer();
  Vote.findOne({_item: itemId, _user: userId}, function(err, vote){
    if(err){
      console.error(err);
      d.reject(err);
    }
    else if(vote){
      d.reject("Already voted");
    }
    else {
      var vote = new Vote({
        _user: userId,
        _item: itemId
      });
      vote.save(function(err, vote){
        if(err){
          console.error(err);
          d.reject(err);
        }
        else {
          Item.getItemById(itemId)
            .then(function(item){
              item.addVote(vote);
            })
            .catch(function(err){
              d.reject(err);
            })
            .done();
          d.resolve(vote);
        }
      });
    }
  });
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

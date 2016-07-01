var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var q = require('q');

var UserSchema = new Schema({
  name: {type: String, required: true, unique: true}
});

UserSchema.statics.createUser = createUser
UserSchema.statics.findByName = findByName

function findByName(name){
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

UserSchema.plugin(uniqueValidator);
User = mongoose.model('User', UserSchema);
module.exports = User;

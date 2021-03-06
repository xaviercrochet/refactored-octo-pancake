var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var User = require('./user');
var Comment = require('./comment');
var Schema = mongoose.Schema;
var q = require('q');

var VoteSchema = new Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  }
});

var ItemSchema = new Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  newsTitle: {
    type: String,
    required: true
  },
  newsUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  votes: [VoteSchema],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});


ItemSchema.statics.createItem = createItem;
ItemSchema.statics.getItems = getItems;
ItemSchema.statics.getItemById = getItemById;

ItemSchema.methods.updateItem = updateItem;
ItemSchema.methods.setUser = setUser;
ItemSchema.methods.addVote = addVote;
ItemSchema.methods.addComment = addComment;

function addComment(userId, comment){
  var d = q.defer();
  var item = this;
  Comment.createComment(userId, item._id, comment)
    .then(function(createdComment){
      item.comments.push(createdComment);
      item.save()
      d.resolve(createdComment);
    }, function(err){
      console.error(err);
      d.reject(err);
    });
  return d.promise;
}

function addVote(userId){
  var vote = new Vote({
    _user: userId
  });
  var d = q.defer();
  if(this._user.equals(userId)){
    d.reject("user is author");
  }
  else {
    var found = false
    this.votes.forEach(function(vote){
      if(vote._user.equals(userId)){
        found = true;
      }
    });
    if(found){
      d.reject("user already voted");
    }
    else {
      this.votes.push(vote);
      this.save(function(err, item){
        if(err){
          console.error(err);
          d.reject(err);
        }
        else{
          d.resolve(item);
        }
      });
    }
  }
  return d.promise;
};

function setUser(userId){
  var d = q.defer();
  this._user = userId;
  this.save(function(err, item){
    if(err) {
      console.err(err);
      d.reject(err);
    }
    else {
      d.resolve(item);
    }
  });
  return d.promise;
}

function updateItem(url, title){
  var d = q.defer();
  if(title.length > 0){
    this.newsTitle = title
  }
  if(url.length > 0){
    this.newsUrl = url;
  }
  this.save(function(err, item){
    if(err) {
      d.reject(err);
    }
    else {
      d.resolve(item);
    }
  });
  return d.promise;
};

function getItemById(id){
  var d = q.defer();
  Item.findById(id)
  .populate('_user')
  .deepPopulate(['comments._author', 'votes._user'])
  .exec(function(err, item){
    if(err) {
      console.error(err);
      d.reject(err);
    }
    else {
      d.resolve(item);
    }
  });
  return d.promise;
}

function createItem(title, url, userId){
  var item = new Item({
    newsTitle: title,
    newsUrl: url,
    _user: userId
  });
  var d = q.defer();
  item.save()
    .then(function(item){
      d.resolve(item);
    }, function(error){
      d.reject(error);
    });
  return d.promise;
}


function getItems() {
  var d = q.defer();
  this.find({}).populate('_user')
  .exec(function(err, items){
    if(err){
      d.reject(new Error(err));
    }
    else {
      d.resolve(items);
    }
  });
  return d.promise;
};

VoteSchema.plugin(uniqueValidator);
ItemSchema.plugin(deepPopulate, {});

var Vote = mongoose.model('Vote', VoteSchema);
var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;

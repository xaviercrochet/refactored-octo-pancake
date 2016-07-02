var mongoose = require('mongoose');
var User = require('./user')
var Schema = mongoose.Schema;
var q = require('q');

var ItemSchema = new Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  newsTitle: String,
  newsUrl : String
});

ItemSchema.statics.createItem = createItem;
ItemSchema.statics.getItems = getItems;
ItemSchema.statics.getItemById = getItemById;

ItemSchema.methods.updateItem = updateItem;
ItemSchema.methods.setUser = setUser;
ItemSchema.methods.addVote = addVote;

function addVote(vote){
  var d = q.defer();
  this.push(vote);
  this.save(function(err, item){
    if(err){
      d.reject(err);
    }
    else{
      d.resolve(item);
    }
  });
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
  Item.findById(id, function(err, item){
    if(err) {
      console.error(err);
      d.reject(err);
    }
    else {
      console.log(item);
      d.resolve(item);
    }
  });
  return d.promise;
}

function createItem(title, url){
  var item = new Item({newsTitle: title, newsUrl: url});
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
  this.find({}, function(err, items){
    if(err){
      d.reject(new Error(err));
    }
    else {
      d.resolve(items);
    }
  });
  return d.promise;
};

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;

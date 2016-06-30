var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var q = require('q');

var ItemSchema = new Schema({
  newsTitle: String,
  newsUrl : String
});

ItemSchema.statics.createItem = createItem;
ItemSchema.statics.getItems = getItems;
ItemSchema.statics.deleteItemById = deleteItemById;
ItemSchema.statics.getItemById = getItemById;

function getItemById(id){
  var d = q.defer();
  this.findById(id, function(err, item){
    if(err) {
      d.reject(err);
    }
    else {
      d.resolve(item);
    }
  });
  return d.promise;
}

function deleteItemById(id){
  var d = q.defer();
  this.findById(id, function(err, item){
    if(err) {
      d.reject(new Error(err));
    }
    else {
      item.remove();
      d.resolve();
    }
  });
  return d.promise;
};

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

Item = mongoose.model('Item', ItemSchema);
module.exports = Item;

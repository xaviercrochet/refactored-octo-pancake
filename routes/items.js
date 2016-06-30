var express = require('express');
var router = express.Router();
var Item = require('../models/item.js');

router.get('/', function(req, res) {
  Item.getItems()
    .then(function(items){
      res.json(items);
    })
    .catch(function(error){
      console.error(error);
      res.sendStatus(500);
    })
    .done();
});

router.delete('/:id', function(req, res){
  var itemId = req.params.id;
  Item.getItemById(itemId)
    .then(function(item){
      item.remove();
      res.json("News successfully deleted.")
    })
    .catch(function(error){
      res.sendStatus(404);
    })
    .done();
});

router.post('/', function(req, res){
  if( (!req.body.itemUrl) || (! req.body.itemTitle) ){
    res.status(500).send("Please provide a title or a url for the news.");
  }
  else {
    Item.createItem(req.body.itemTitle, req.body.itemUrl)
      .then(function(item){
        res.json(item);
      })
      .catch(function(err){
        console.error(err);
        res.sendStatus(404);
      })
      .done();
    }
});

router.get('/:id', function(req, res){
  var itemId = req.params.id;
  Item.getItemById(itemId)
    .then(function(item){
      res.json(item);
    })
    .catch(function(err){
      console.error(err);
      res.sendStatus(404);
    })
    .done();
});

module.exports = router;

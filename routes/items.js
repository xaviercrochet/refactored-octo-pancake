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

router.get('/:id', function(req, res){
  var itemId = req.params.id;
  Item.getItemById(itemId)
    .then(function(item){
      res.json(item);
    })
    .catch(function(err){
      console.log(err);
      res.sendStatus(404);
    })
    .done();
});

module.exports = router;

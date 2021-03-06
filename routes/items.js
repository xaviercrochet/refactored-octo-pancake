var express = require('express');
var router = express.Router();

var Auth = require('../scripts/authentication');
var userSessionMgmt = require('../scripts/user-session-mgmt');
var Item = require('../models/item');
var Comment = require('../models/comment');

router.post('/authenticate', function(req, res){
  if(!req.body.name){
    req.status(500).send("Name is empty");
  }
  else {
    User.getUserByName(req.body.name)
      .then(function(user){
        if(user){
          res.json("Authenticated successfully");
        }
        else {
          res.status(401).send("Authentication failed.");
        }
      })
      .catch(function(err){
        res.status(404).send(err);
      });
  }
});

router.post('/:id/comments', Auth, function(req, res){
  var itemId = req.params.id;
  var userId = userSessionMgmt.getCurrentUser()._id
  if(!req.body.comment){
    res.status(500).send("Please provide a comment.");
  }
  else {
    Item.findById(itemId)
      .then(function(item){
          return item.addComment(userId, req.body.comment)
        }).then(function(createdComment){
          return Comment.findById(createdComment._id).populate('_author');
        }).then(function(commentWithAuthor){
          res.json(commentWithAuthor);
        }, function(err){
          console.error(err);
          res.status(500).send(err);
        });
  }
});

router.get('/', function(req, res) {
  Item.getItems()
    .then(function(items){
      res.json(items);
    })
    .catch(function(error){
      res.sendStatus(500);
    })
    .done();
});

router.put('/:id', Auth, function(req, res){
  var itemId = req.params.id;
  if( (!req.body.newsUrl) || (! req.body.newsTitle) ){
    res.status(500).send("Please provide a title or a url for the news.");
  }
  else {
    Item.getItemById(itemId)
      .then(function(item){
        item.updateItem(req.body.newsUrl, req.body.newsTitle);
        res.json(item);
      })
      .catch(function(error){
        res.sendStatus(404);
      })
      .done()
  }
});

router.delete('/:id', Auth, function(req, res){
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


router.post('/', Auth, function(req, res){
  if( (!req.body.itemUrl) || (! req.body.itemTitle) ){
    res.status(500).send("Please provide a title or a url for the news.");
  }
  else {
    Item.createItem(req.body.itemTitle, req.body.itemUrl, userSessionMgmt.getCurrentUser()._id)
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
      res.sendStatus(404);
    })
    .done();
});


router.post('/:id/vote', Auth, function(req, res){
  var itemId = req.params.id;
  var userId = userSessionMgmt.getCurrentUser()._id;
  User.getUserById(userId)
    .then(function(user){
      return user.vote(itemId);
    })
    .then(function(user){
      res.json("Vote successfully recorded");
    })
    .catch(function(err){
      if(err == "Already voted"){
        res.json(err);
      }
      else {
        res.status(404).send(err);
      }
    })
    .done();
});

module.exports = router;

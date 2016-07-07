var mongoose = require('mongoose');
var User = require('./user');
var Item = require('./item');
var Schema = mongoose.Schema;
var q = require('q');

/* TODO: allow ones to comment other's comments */
var CommentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  _author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  /*
    See http://mongoosejs.com/docs/populate.html#dynamic-ref
    When adding commenting-comment feature
  */
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }
});

CommentSchema.statics.createComment = createComment;

function createComment(userId, subjectId, commentContent){
  var comment = new Comment({
    _author: userId,
    subject: subjectId,
    content: commentContent
  });
  var d = q.defer();
  comment.save()
    .then(function(createdComment){
      d.resolve(createdComment);
    }, function(err) {
      console.error(err);
      d.reject(err);
  });
  return d.promise;
};

var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Item = require('./item');
var q = require('q')

var VoteSchema = new Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
  _item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }
});

Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote;

var mongoose = require('mongoose');

exports.messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  nickname: '',
  target: '',
  message: '',
  timestamp: ''
});

exports.messageModel = mongoose.model('messages', exports.messageSchema);
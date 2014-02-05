var mongoose = require('mongoose');

exports.messageSchema = new mongoose.Schema({
  username: '',
  target: '',
  message: '',
  timestamp: ''
});

exports.messageModel = mongoose.model('messages', exports.messageSchema);
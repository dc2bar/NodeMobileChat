var mongoose = require('mongoose');

exports.messageSchema = new mongoose.schema({
  _id: mongoose.schema.objectId,
  nickname: '',
  target: '',
  message: '',
  timestamp: ''
});

exports.messageModel = mongoose.model('messages', exports.messageSchema);
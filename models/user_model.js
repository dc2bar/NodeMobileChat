var mongoose = require('mongoose');

exports.userSchema = new mongoose.schema({
  _id: mongoose.schema.objectId,
  socket_id: '',
  nickname: '',
  font: '',
  level: ''
});

exports.userModel = mongoose.model('users', exports.userSchema);
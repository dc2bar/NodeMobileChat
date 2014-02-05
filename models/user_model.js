var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  socket_id: '',
  nickname: '',
  font: '',
  level: ''
});

exports.userModel = mongoose.model('users', exports.userSchema);
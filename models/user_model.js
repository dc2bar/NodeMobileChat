var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  socket_id: '',
  nickname: '',
  font: '',
  level: ''
});

exports.userModel = mongoose.model('users', exports.userSchema);
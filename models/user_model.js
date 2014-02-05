var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  socket_id: '',
  username: '',
  font: '',
  level: ''
});

exports.userModel = mongoose.model('users', exports.userSchema);
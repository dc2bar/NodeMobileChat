var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  socket_id: '',
  nickname: '',
  font: '#0000FF|b',
  level: 'user'
});

exports.userModel = mongoose.model('users', exports.userSchema);
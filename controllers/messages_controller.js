var userModel = require('../models/user_model').userModel;
var messageModel = require('../models/message_model').messageModel;

// Receive and broadcast messages
exports.message = function(io, socket, data) {
  // No message, no fun
  if (!data.message) {
    socket.emit('error', {
      message: 'no message provided'
    });
    return;
  }

  // Find client broadcasting the message
  userModel.findOne({
    socket_id: socket.id
  }, function(error, document) {
    // Oops...
    if (error) {
      socket.emit('error', {
        message: 'error reading clients list'
      });
      return;
    }

    // Who is she?
    if (!document) {
      socket.emit('message error', {
        message: 'client not found'
      });
      return;
    }

    // Prepare message
    var message = {
      nickname: document.nickname,
      message: data.message,
      timestamp: Date.now()
    }

    var log = new messageModel(message);
    log.save();

    // Broadcast to the world
    io.sockets.emit('message', message);
  });
}
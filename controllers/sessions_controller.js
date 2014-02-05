var userModel = require('../models/user_model').userModel;

// Someone tries to login
exports.login = function(io, socket, data) {
  // No username? Sorry
  if (!data.username) {
    socket.emit('error', {
      message: 'no username provided'
    });
    return;
  }

  // Seach for duplicate usernames
  userModel.findOne({
    username: data.username
  }, function(err, doc) {
    // Oops...
    if (err) {
      socket.emit('error', {
        message: 'error reading clients list'
      });
      return;
    }

    // Duplicated username :(
    if (doc) {
      console.warn('username in use, orphan records?', doc.username);

      socket.emit('login error', {
        message: 'username in use'
      });
      return;
    }

    // So far, so good! Save new client for future references
    var user = new userModel();

    user.username = data.username;
    user.socket_id = socket.id;
    user.font = "#0000FF";
    user.level = "user";

    user.save(function() {
      // And inform the client :)
      socket.emit('login ok', {
        username: data.username
      });

      // And finally, broadcast a clients update
      exports.clients(io, socket);
    });
  });
}

// Someone is manually login out
exports.logout = function(io, socket, data) {
  // Reuse ;) disconnect
  exports.disconnect(io, socket, data);
}

// Broadcast clients to the world
exports.clients = function(io, socket, data) {
  userModel.find({}, function(err, data) {
    io.sockets.emit('clients', {
      clients: data
    });
  });
}

// Oops, disconnected!
exports.disconnect = function(io, socket, data) {
  // Who was she?
  userModel.findOne({
    socket_id: socket.id
  }, function(err, doc) {
    // Oops...
    if (err) {
      socket.emit('error', {
        message: 'error reading clients list'
      });
      return;
    }

    // OMG! A ghost!
    if (!doc) {
      socket.emit('logout error', {
        message: 'client not found'
      });
      return;
    }

    // Remove the client from DB to release the username
    doc.remove(function() {
      socket.emit('logout ok');
    });

    // Broadcast current clients
    exports.clients(io, socket);
  });
}
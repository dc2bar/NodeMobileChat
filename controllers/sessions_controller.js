var userModel = require('../models/user_model').userModel;

var user = new userModel();
user.socket_id = 'asdf';
user.nickname = 'my nickname';
user.font = 'my font';
user.level = 'admin';
user.save(function(error,user) {
  if(error) {
    console.log('Save Error!');
    console.log(error);
  } else {
    console.log('user saved without error: ');
    console.log(user);
  }
});

userModel.find({}, function(error, results) {
  if(error) {
    console.log('find error!');
    console.log(error);
  } else {
    console.log('find results:');
    console.log(results);
  }
});

/*
// Someone tries to login
exports.login = function(io, socket, data) {
  // No nickname? Sorry
  if (!data.nickname) {
    socket.emit('error', {
      message: 'no nickname provided'
    });
    return;
  }

  // Seach for duplicate nicknames
  userModel.findOne({
    nickname: data.nickname
  }, function(err, doc) {
    // Oops...
    if (err) {
      socket.emit('error', {
        message: 'error reading clients list'
      });
      return;
    }

    // Duplicated nickname :(
    if (doc) {
      console.warn('nickname in use, orphan records?', doc.nickname);

      socket.emit('login error', {
        message: 'nickname in use'
      });
      return;
    }

    // So far, so good! Save new client for future references
    var user = new userModel();

    user.nickname = data.nickname;
    user.socket_id = socket.id;

    console.log('user created:');
    console.log(user);

    user.save(function() {
      // And inform the client :)
      socket.emit('login ok', {
        nickname: data.nickname
      });

      console.log('user saved:');
      console.log(user);

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
  console.log(userModel);
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

    // Remove the client from DB to release the nickname
    doc.remove(function() {
      socket.emit('logout ok');
    });

    // Broadcast current clients
    exports.clients(io, socket);
  });
}*/
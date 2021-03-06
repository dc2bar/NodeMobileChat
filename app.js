//application variables
var port = 80;

//application dependencies
var express = require('express'),
    app = express(),
    io = require('socket.io').listen(app.listen(port));

//Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/devNodeChat');


//Controllers
var sessions = require('./controllers/sessions_controller'),
    messages = require('./controllers/messages_controller');

//Models
var userModel = require('./models/user_model').userModel;

//Routes
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

/*************
 * Startup
 */
console.log('NodeChat started. Listening on port ' + port);

//reset DB on fresh boot
var user = new userModel();
user.collection.drop();

/*************
 * Socket I/O
 */
io.sockets.on('connection', function(socket) {

  // Chat Login
  socket.on('login attempt', function(data) {
    sessions.login(io, socket, data);
  });

  // Chat Logout
  socket.on('logout attempt', function(data) {
    sessions.logout(io, socket, data);
  });

  // Update User Settings
  socket.on('update setting', function(data) {

  });

  // Standard Chat Message
  socket.on('message', function(data) {
    messages.message(io, socket, data);
  });

  // Private Chat Message
  socket.on('privateMessage', function(data) {
    messages.privateMessage(io, socket, data);
  });

  // Disconnection
  socket.on('disconnect', function(data) {
    sessions.disconnect(io, socket, data);
  });
});

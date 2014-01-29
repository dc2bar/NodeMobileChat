var express = require('express');
var app = express();
var port = 80;

//include JS
app.use(express.static(__dirname + '/public'));

//initialize socket
var io = require('socket.io').listen(app.listen(port));

//routing
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function (req, res) {
  res.render('page');
});

//Currently Connected Users
var connectedUsers = {};

//Chat seesion variables
var messageOnConnect = 'Connected to Node Chat';

//Socket I/O - the bread and butter of chat
//NOTE: When user connects, a unique socket is created for them and persists until disconnection
io.sockets.on('connection', function (socket) {

  //Store username on connect and announce
  socket.on('updateUsername', function (username) {
    if( updateUsers('add', username, socket.id) == 'success' ) {
      socket.username = username;
      socket.broadcast.emit('systemMessage', username + ' has connected');
    }
  });

  //show MOTD on connect
  socket.emit('systemMessage', { message: messageOnConnect });

  //When this client sends a chat message
  socket.on('sendChat', function (data) {
    io.sockets.emit('chatMessage', username, data);
  });
});

// When the user disconnects - TODO: think of a way to prevent mobile temporary disconnect spam
socket.on('disconnect', function () {
  updateUsers('delete', socket.username, socket.id)
});

function updateUsers(action, username, sessionID) {
  var userInList = connectedUsers.filter(function (person) { return person.username == username });
  switch(action)
  {
    case 'add':
      if( !userInList ) {
        connectedUsers[sessionID] = username;
        socket.emit('updateUsersList',connectedUsers);
      } else {
        console.log('attempted to add user ' + username + ' with session id ' + sessionID + ' to active users when following user exists: ');
        console.log(userInList);
      }
      return 'success';
    case 'delete':
      if( !userInList ) {
        console.log('attempted to remove user ' + username + ' with session id ' + sessionID + ' - no such user exists');
        console.log(userInList);
      } else {
        delete connectedUsers[sessionID];
        socket.emit('updateUsersList',connectedUsers);
        io.sockets.emit('systemMessage', username + ' has disconnected.');
      }
      return 'success';
  }
}

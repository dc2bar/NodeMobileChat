/*
this shit all needs to be broken up into MVC. it's just a big lump right now. zero fucks given. work now, refactor later.
 */

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

//Chat in memory - server goes down, memory wiped, no logs. leftover from cryptochat
//TODO: implement mongo DB and use hash or something for current msg id. this shit sucks.
var chatlog = [];
var currentMsgID = 0;

//Chat seesion variables
var messageOnConnect = 'Connected to Node Chat';

//Socket I/O - the bread and butter of chat
//NOTE: When user connects, a unique socket is created for them and persists until disconnection
io.sockets.on('connection', function (socket) {

  //Store username on connect and announce
  socket.on('updateUsername', function (username) {
    if( updateUsers('add', username, socket.id) == 'success' ) {
      socket.username = username;
      sendMessage('chatMessage', 'SYSTEM', username + ' has connected');
    }
  });

  //show MOTD on connect
  sendMessage('chatMessage','MOTD', messageOnConnect);

  //When this client sends a chat message
  socket.on('sendChat', function (data) {
    sendMessage('chatMessage',socket.username,data)
  });

  //when client requests chat resync
  socket.on('resync', function (lastReceived) {
    var chatSyncData = resyncChat(lastReceived);
    if( chatSyncData ) {
      socket.emit('resyncChat', chatSyncData);
    };
    resyncUsers();
  });

  // When the user disconnects
  // TODO: think of a way to prevent mobile temporary disconnect spam. timer/heartbeat sync event?
  socket.on('disconnect', function () {
    updateUsers('delete', socket.username, socket.id)
  });
});

function updateUsers(action, username, sessionID) {
  var userInList = false;
  for( var key in connectedUsers ) {
    var currentUsername = connectedUsers[key];
    if ( currentUsername == username ) {
      userInList = true;
    }
  }
  switch(action)
  {
    case 'add':
      if( !userInList ) {
        connectedUsers[sessionID] = username;
        resyncUsers();
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
        resyncUsers();
        io.sockets.emit('systemMessage', username + ' has disconnected.');
      }
      return 'success';
  }
}

function sendMessage(type,username,message) {
  chatlog.push(
      {id: currentMsgID, user: username, msg: message}
  );
  io.sockets.emit( type, username, message, currentMsgID );
  if(chatlog.length > 50) {
    chatlog.slice();
  }
  currentMsgID++;
}

function resyncUsers() {
  io.sockets.emit('updateUsersList',connectedUsers);
}

function resyncChat(lastMsgID) {
  if(chatlog.length > 0){
    var lastLogID = chatlog[chatlog.length - 1].id;
    if(lastLogID > lastMsgID) {
      return chatlog;
    }
  }
  return false;
}

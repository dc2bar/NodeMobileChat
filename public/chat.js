$(function () {
  var socket = io.connect('/');
  var field = $("#field");
  var sendButton = $("#send");
  var content = $("#content");
  var usersList = $('#users');

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.emit('updateUsername', 'TESTUSER');

  socket.on('chatMessage', function (username, message) {
    var message = addChat('chat', message, username);
    console.log(message);
    content.append(message);
  });

  socket.on('systemMessage', function (message) {
    console.log('SYSTEM: ' + message);
    addChat('chat', message, 'SYSTEM');
  });

  socket.on('updateUsersList', function (data) {
    var users = updateUsersList(data);
    usersList.empty().html(users);
  });

  sendButton.click(function () {
    var text = field.val();
    socket.emit('sendChat', text);
  });
});

function addChat(type, data, username) {
  var message = '';
  switch (type) {
    case 'chat':
      message = data;
      break;
  }
  return '<div class="'+username+' chat-line"><span class="username">'+username+': </span><span class="message">'+message+'</span></div>';
}

function updateUsersList(data) {
  var userslist = '';
  for( var id in data) {
    var user = data[id];
    userslist += '<div class="'+username+' userslist-line" data-sid="'+id+'"><span class="username">'+user+'</span></div>';
  };
  return userslist;
}
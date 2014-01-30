var socket = io.connect('/');
$(function () {
  var field = $("#field");
  var sendButton = $("#send");
  var content = $("#content");
  var usersList = $('#users');
  var currentUsername = prompt("Pick a Username (debug)","");

  socket.emit('updateUsername', currentUsername);

  socket.on('resyncChat', function (chatlog) {
    content.empty().append(resyncChat(chatlog));
  });

  socket.on('chatMessage', function (username, message, id) {
    var message = addChat('chat', message, username, id);
    content.append(message);
  });

  socket.on('systemMessage', function (message) {
    var message = addChat('chat', message, 'SYSTEM');
    content.append(message);
  });

  socket.on('updateUsersList', function (data) {
    var users = updateUsersList(data);
    usersList.empty().html(users);
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  sendButton.click(function () {
    var text = field.val();
    socket.emit('sendChat', text);
  });
});

function resyncChat(chatlog) {
  var buffer = '';
  for(var lineID in chatlog) {
    var chatline = chatlog[lineID];
    buffer += addChat('chat', chatline.msg, chatline.username, chatline.id);
  }
  return buffer;
}

function addChat(type, data, username, id) {
  var message = '';
  switch (type) {
    case 'chat':
      message = data;
      break;
  }
  return '<div id="chatline-'+id+'" class="'+username+' chat-line"><span class="username">'+username+': </span><span class="message">'+message+'</span></div>';
}

function updateUsersList(data) {
  var userslist = '';
  for( var id in data) {
    var username = data[id];
    userslist += '<div class="'+username+' userslist-line" data-sid="'+id+'"><span class="username">'+username+'</span></div>';
  };
  return userslist;
}
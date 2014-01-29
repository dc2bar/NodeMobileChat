$(function () {
  var socket = io.connect('/');
  var field = $("#field");
  var sendButton = $("#send");
  var content = $("#content");

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.on('chatMessage', function (username, message) {
    var message = addChat('chat', message, username));
    content.append(message);
  });

  sendButton.click(function () {
    var text = field.val();
    socket.emit('sendChat', text);
  });
});

function addChat(type, data, username) {
  var message = '';
  switch (type) {
    case 'system':
      username = 'SERVER';
      message = data;
      break;
    case 'chat':
      message = data;
      break;
  }
  return '<div class="'+username+' chat-line"><span class="username"></span><span class="message"></span></div>';
}
$(function(){
    var messages = [];
    var socket = io.connect('/');
    var field = $("#field");
    var sendButton = $("#send");
    var content = $("#content");

    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data.message);
            var html = '';
            for (var i = 0; i < messages.length; i++) {
                html += messages[i] + '<br />';
            }
            content.text(html);
        } else {
            console.log("There is a problem:", data);
        }
    });

    sendButton.click(function () {
        var text = field.val();
        socket.emit('send', { message: text });
    });
});
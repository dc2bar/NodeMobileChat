$( function() {
  var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

  /*
    Views
   */

  var loginView = Backbone.View.extend({
    el: '#login',
    username: '',
    color: '#000000',

    events: {
      'click .btn.login': 'login',
      'click .btn.logout': 'logout'
    },

    initialize: function() {
      _.bindAll(this, 'activateColors');
      this.render();
      socket.on('login ok', this.loginOk);
      socket.on('login error', this.loginError);
      socket.on('logout ok', this.logoutOk);
    },

    render: function() {
      var template = Handlebars.templates['login_modal'];
      $(this.el).html(template());
      this.activateColors();
      $('#myModal').modal({keyboard: false});
    },

    activateColors: function() {
      var that = this;
      $('#colorSelector', this.el).ColorPicker({
        color: '#FFFFFF',
        onShow: function (colpkr) {
          $(colpkr).fadeIn(500);
          return false;
        },
        onHide: function (colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        onChange: function (hsb, hex, rgb) {
          $('#colorSelector div').css('backgroundColor', '#' + hex);
          that.color = hex;
        }
      });
    },

    login: function() {
      this.username = this.$('#username').val() || 'johndoe' + parseInt(Math.random() * 10);
      socket.emit('login attempt', {
        username: this.username,
        color: this.color
      });
      return false;
    },

    loginOk: function(data) {
      console.log(data.username + ' logged in');
      this.remove();
    },

    loginError: function(data) {
      alert(data.message);
    },

    logout: function() {
      socket.emit('logout attempt', {
        username: this.username
      });
      return false;
    },

    logoutOk: function(data) {
      this.$('.logout-form').hide();
      this.$('.login-form').show();
    }
  });

  var userlistView = Backbone.View.extend({
    el: '#userlist',

    events: {
      'click .user': 'privateMessage'
    },

    initialize: function() {
      _.bindAll(this, 'updateClients');
      this.render();
      socket.on('clients', this.updateClients);
    },

    render: function(users) {
      var template = Handlebars.templates['userlist'];
      $(this.el).html(template({users: users}));
    },

    updateClients: function (data) {
      if(!data.clients) {
        console.log('ERROR: got no clients back!');
      } else {
        this.render(data.clients);
      }
    }
  })

  var messagesView = Backbone.View.extend({
    el: '#messages',

    events: {
      'keypress #chat-input' : 'sendChat',
      'click #send-chat-button' : 'sendChat'
    },

    initialize: function() {
      _.bindAll(this, 'chatReceived');
      socket.on('message', this.chatReceived);
    },

    sendChat: function(e){
      if((e.type == 'keypress' && e.keyCode == 13) || (e.type == 'click' && e.target.id == 'send-chat-button')) {
        var message = $('#chat-input',this.el).val();
        $('#chat-input',this.el).val('');
        socket.emit('message',{message: message});
      }
    },

    chatReceived: function (data) {
      var template = Handlebars.templates['chat_line'];
      $('.chat-text',this.el).append(template(data));
      $(".chat-text").scrollTop($(".chat-text")[0].scrollHeight);
    }
  })

  var login = new loginView();
  var userlist = new userlistView();
  var messages = new messagesView();
});

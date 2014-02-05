$( function() {
  var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

  /*
    Views
   */

  var loginView = Backbone.View.extend({
    el: '#login',
    username: '',

    events: {
      'click .btn.login': 'login',
      'click .btn.logout': 'logout'
    },

    initialize: function() {
      this.render();
      socket.on('login ok', this.loginOk);
      socket.on('login error', this.loginError);
      socket.on('logout ok', this.logoutOk);
    },

    render: function() {
      var template = Handlebars.templates['login_modal'];
      $(this.el).html(template());
    },

    login: function() {
      this.username = this.$('#username').val() || 'johndoe' + parseInt(Math.random() * 10);
      socket.emit('login attempt', {
        username: this.username
      });
      return false;
    },

    loginOk: function(data) {
      console.log(data.username + " logged in");
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
    username: '',

    events: {
      'click .user': 'privateMessage'
    },

    initialize: function() {
      this.render();
      socket.on('clients', this.updateClients);
    },

    render: function(users) {
      var template = Handlebars.templates['userlist'];
      for(var i in users){
        console.log(users[i]);
      }
      $(this.el).html(template({users: users}));
    },

    updateClients: function (data) {
      if(!data.clients) {
        console.log('ERROR: got no clients back!');
      } else {
        userlist.render(data.clients);
      }
    }
  })

  var login = new loginView();
  var userlist = new userlistView();
});
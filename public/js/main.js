var socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);

var LoginView = Backbone.View.extend({
  el: '#login',
  nickname: '',

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
    this.el.html(template);
  },

  login: function() {
    this.nickname = this.$('#nickname').val() || 'johndoe' + parseInt(Math.random() * 10);
    socket.emit('login attempt', {
      nickname: this.nickname
    });
    return false;
  },

  loginOk: function(data) {
    this.$('.login-form').hide();
    this.$('.logout-form').show();
    this.$('.nickname-display').text(data.nickname);
  },

  loginError: function(data) {
    alert(data.message);
  },

  logout: function() {
    socket.emit('logout attempt', {
      nickname: this.nickname
    });
    return false;
  },

  logoutOk: function(data) {
    this.$('.logout-form').hide();
    this.$('.login-form').show();
  }
});
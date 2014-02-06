Handlebars.registerHelper("formatTimestamp", function(timestamp) {
  function addZero(number) {
    if(number < 10) {
      return ( "0" + number );
    }
    return number;
  }

  function AMPM(time) {
    var letters = "AM";
    if (time[0] > 12) {
      time[0] = time[0] - 12;
      letters = "PM";
    }
    return ( time[0] + ":" + time[1] + ":" + time[2] + letters );
  }

  var d = new Date(1391654210697);

  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());

  var time = AMPM([h,m,s]);

  return time;
});
var events = [];
var last_event; //debugging helper var
var SEND_URL = "http://192.168.1.121/event_actions"
var GET_URL = "http://192.168.1.121/event_actions"

events_str = '';

$(function() {
  //event_names = "blur focus load resize scroll unload beforeunload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error ready";
  event_names = "click";
  
  $('#link').click(function(){
    playbackEvents(events_str)
  });
  
  $('div').click(function(){
    $(this).css('background-color', '#' + genHex());    
  });

  //dont listen right at first
  setTimeout(function(){
    $('body *').bind(event_names, logEvent);    
    log('listening');    
  }, 100);
  
  //flush to ajax periodically
  var pusher = setTimeout(sendData, 1000);
});

function logEvent(event) {
  // var ev = {
  //   id: event.currentTarget.id,
  //   event_name: event.type.toString(),
  //   timestamp: new Date().valueOf()
  // }
  // events.push(ev);
  // 
  events_str += event.currentTarget.id + '|' + event.type.toString() + '|' + (parseInt(new Date().valueOf() / 1000)) + '&'
}

function log(data) { console.log(data); }

function serializeArray(arr) {
  return $(arr).map(function(){return serialize(this)});
}

function serialize(obj) {
  var arr = [];
  for (key in obj) {
    arr.push(key + '=' + obj[key]);
  }  
  return arr.join('&');
}

function sendData() {
  //send the events joined with a tripple pipe for now
  log('sending' + events_str);
  $.ajax({
    type: 'POST',
    url: SEND_URL,
    data: {data: events_str}
  });
  
  //clear events
  // events = [];
}

function getEventsToPlay() {
  $.get(GET_URL, {
    success: playbackEvents
  });
}

function playbackEvents(event_str) {
  //   log('done listening');
  var first_timestamp = -1;
  
  _events = event_str.split('&');
  log(_events);
  $(_events).each(function(){
    var parts = this.split('|');
    
    if (parts.length >= 3) {
      var id = parts[0];
      var event_name = parts[1];
      var timestamp = parts[2];
    
      if (first_timestamp == -1) {
        first_timestamp = timestamp;
      }
    
      var delay = timestamp - first_timestamp;
      log(timestamp + " | " + first_timestamp);
      log(delay);
      setTimeout(function(){
        $('#' + id).triggerHandler(event_name);
      }, delay * 1000);
    }
  });
}



//NASTY, from http://www.namepros.com/code/37251-javascript-random-hex-color.html
function genHex(){
  colors = new Array(14)
  colors[0]="0"
  colors[1]="1"
  colors[2]="2"
  colors[3]="3"
  colors[4]="4"
  colors[5]="5"
  colors[5]="6"
  colors[6]="7"
  colors[7]="8"
  colors[8]="9"
  colors[9]="a"
  colors[10]="b"
  colors[11]="c"
  colors[12]="d"
  colors[13]="e"
  colors[14]="f"

  digit = new Array(5)
  color=""
  for (i=0;i<6;i++){
    digit[i]=colors[Math.round(Math.random()*14)]
    color = color+digit[i]
  }
  return color;
}
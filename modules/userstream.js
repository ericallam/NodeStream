var sys = require('sys'),
   http = require('http');
var base64 = require('./base64');

var Module = this.Module = function(){
  this.start = function(connection){
    var chirpstream = http.createClient(80, 'chirpstream.twitter.com');
    var username = 'thepalephantom';
    var password = 'maverick1$good';
    var auth = username + ':' + password;
    auth = 'Basic ' + base64.encode(auth);
    sys.puts(auth);
    var request = chirpstream.request('GET', '/2b/user.json', {'host': 'chirpstream.twitter.com', 'Authorization': auth});
    request.should_keep_alive = true;
    request.addListener('response', function (response) {
        if(response.statusCode == 200){
        sys.puts('STATUS: ' + response.statusCode);
        sys.puts('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.addListener('data', function (chunk) {
          sys.debug(sys.inspect(chunk));
          if(chunk != '\r\n'){
            connection.send(chunk);
          }else{
            // each chunk
          }
        });    
      }

    });

    request.end();    
  }
};

Module.prototype.onData = function(data, connection){
  if (data == 'start'){
    this.start(connection);
  }  
};

Module.prototype.onDisconnect = function(connection){
  clearInterval(this.interval);
};


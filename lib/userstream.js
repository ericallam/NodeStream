var sys = require('sys'),
    http = require('http'),
	  pass =  require('../pass');
var base64 = require('./base64');

var UserStream = (function(){
  var chirp_host = 'chirpstream.twitter.com';
  var username = pass.username;
  var password = pass.password;
  var auth = username + ':' + password;
  auth = 'Basic ' + base64.encode(auth);
  var path = '/2b/user.json';
  var headers = {'host': chirp_host, 'Authorization': auth};
  var live_responses = [];
  
  var syslog = function(str){
    sys.debug(sys.inspect(str));
  }
  
  return {
    
    make_request: function(connection, query_params){
      // destroy any live responses and remove them from the live response queue
      if(live_responses.length){
        for (var i=0; i < live_responses.length; i++) {
          if(live_responses[i]){
            syslog("killing response " + i);
            live_responses[i].pause();
            syslog("killed response " + i);
            live_responses[i] = undefined;          
          }
        }
      }
    
      syslog("Making new request");
      syslog("path: " + path);
      syslog("headers: " + JSON.stringify(headers));
    
      var query_string = "";
      if(query_params){
        var pairs = [];
        for(key in query_params){
          pairs.push(key + "=" + query_params[key]);
        }
        query_string = "?" + pairs.join('&')
      }
      syslog('query params: ' + query_string);
      var chirpstream = http.createClient(80, chirp_host);
      var request = chirpstream.request('GET', path + query_string, headers);
      request.should_keep_alive = true;
      request.addListener('response', function (response) {
        if(response.statusCode == 200){
          sys.debug(sys.inspect('STATUS: ' + response.statusCode));
          sys.debug(sys.inspect('HEADERS: ' + JSON.stringify(response.headers)));
          response.setEncoding('utf8');
          response.addListener('data', function (chunk) {
            sys.debug(sys.inspect(chunk));
            if(chunk != '\r\n'){
              connection.send(chunk);
            }
          }); // end addListener data

          live_responses.push(response);
        } // end if status code == 200

      }); // end of the addListener response

      request.end();    
    },
  
    start: function(connection){
      this.make_request(connection);
    }
  }
})();

exports.make_request = UserStream.make_request;
exports.start = UserStream.start;
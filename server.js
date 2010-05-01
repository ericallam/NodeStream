var sys = require('sys'),
    http = require('http'),
    io = require('./socket.io/lib/socket.io'),
    userstream = require('./lib/userstream');
    
server = http.createServer(function(req, res){
    // your normal server code
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.writeBody('<h1>Hello world</h1>');
    res.finish();
});

server.listen(8080);

// socket.io, I choose you
var listener = io.listen(server, {
		
	onClientConnect: function(client){
	  sys.puts("onClientConnect: ");
    sys.puts(sys.inspect(client));
    userstream.make_request(client);
	},
	
	onClientDisconnect: function(client){
	  sys.puts("onClientDisconnect: ");
		sys.puts(sys.inspect(client));
	},
	
	onClientMessage: function(data, client){
	  sys.puts("onClientMessage: ");
	  sys.puts(sys.inspect(data));
		sys.puts(sys.inspect(client));
		
    if (data.length){
      try {
        var message = JSON.parse(data);
        switch(message['method']) {
          case 'new_search':
            sys.debug(sys.inspect('new_search: ' + message['search']));
            userstream.make_request(client, {'track': message['search']});
            break;
          default:
          // do nothing
        }
      } catch(e){
        sys.puts(sys.inspect(e));
      }
    }
    
	}
	
});
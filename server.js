var sys = require('sys'),
    http = require('http'),
    io = require('./socket.io/lib/socket.io');
var kiwi = require('kiwi')
var UserStream = kiwi.require('twitter-userstream').UserStream
    
server = http.createServer(function(req, res){
    // your normal server code
    res.writeHeader(200, {'Content-Type': 'text/html'});
    res.writeBody('<h1>Hello world</h1>');
    res.finish();
});

server.listen(8080);

var send_to_client = function(client, obj, type){
  client.send(JSON.stringify({type: type, payload: obj}));
}

var credentials = process.argv[2].split(':');

var username = credentials[0];
var password = credentials[1];

var userstream = new UserStream({
  username: username,
  password: password,
  debug: false
});

// socket.io, I choose you
var listener = io.listen(server, {
		
	onClientConnect: function(client){
	  sys.puts("onClientConnect: ");
    sys.puts(sys.inspect(client));
    
    userstream
      .onFriends(function(friends){
        send_to_client(client, friends, "friends");
      })
      .onStatus(function(status){
        send_to_client(client, status, "status");
      })
      .onRetweet(function(retweet){
        send_to_client(client, retweet, "retweet");
      })
      .onFavorite(function(favorite){
        send_to_client(client, favorite, "favorite");
      })
      .onUnfavorite(function(unfavorite){
        send_to_client(client, unfavorite, "unfavorite");
      })
      .onFollow(function(follow){
        send_to_client(client, follow, "follow");
      })
      .onUnfollow(function(unfollow){
        send_to_client(client, unfollow, "unfollow");
      })
      .onBlock(function(block){
        send_to_client(client, block, "block");
      });
    
    userstream.stream();
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
            userstream.search(message['search'])
            userstream.stream();
            break;
          case 'clear_search':
            userstream.clear_search();
            userstream.stream();
          default:
          // do nothing
        }
      } catch(e){
        sys.puts(sys.inspect(e));
      }
    }
    
	}
	
});

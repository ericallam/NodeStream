var sys          = require('sys'),
    http         = require('http'),
    io           = require('./socket.io/lib/socket.io');
var kiwi         = require('kiwi')
var UserStream   = kiwi.require('twitter-userstream').UserStream
var mongo        = require('./libs/mongodb/lib/mongodb');
var repl         = require("repl");
var TwitterEvent = require('./javascripts/twitter_event').TwitterEvent;

var host = 'localhost'
var port = 27017;

var db = new mongo.Db('nodestream', new mongo.Server(host, port, {}), {});

// repl.start().scope.db = db;

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
db.open(function(p_db) {
  var twitter_event = new TwitterEvent(db, function() {
    
    var listener = io.listen(server, {
		
    	onClientConnect: function(client){
    	  sys.puts("onClientConnect: ");
    	  
    	  twitter_event.findEvents(100, function(err, cursor){
          sys.puts("OLD EVENTS:");
          cursor.each(function(err, item){
            if(item){
              send_to_client(client, item.payload, item.type);
            }
          });
    	  });
    	      
        userstream
          .onFriends(function(friends){
            send_to_client(client, friends, "friends");
          })
          .onStatus(function(status){
            twitter_event.insertEvent('status', status);
            send_to_client(client, status, "status");
          })
          .onRetweet(function(retweet){
            twitter_event.insertEvent('retweet', retweet);
            send_to_client(client, retweet, "retweet");
          })
          .onFavorite(function(favorite){
            twitter_event.insertEvent('favorite', favorite);
            send_to_client(client, favorite, "favorite");
          })
          .onUnfavorite(function(unfavorite){
            twitter_event.insertEvent('unfavorite', unfavorite);
            send_to_client(client, unfavorite, "unfavorite");
          })
          .onFollow(function(follow){
            twitter_event.insertEvent('follow', follow);
            send_to_client(client, follow, "follow");
          })
          .onUnfollow(function(unfollow){
            twitter_event.insertEvent('unfollow', unfollow);
            send_to_client(client, unfollow, "unfollow");
          })
          .onBlock(function(block){
            twitter_event.insertEvent('block', block);
            send_to_client(client, block, "block");
          })
    
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
	
    }); // end io.listen
    
  }); // end setup collection
  
});
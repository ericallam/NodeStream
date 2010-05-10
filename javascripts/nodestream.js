(function($) {
  
var webSocket = new io.Socket('localhost', {rememberTransport: false, port: 8080}),
    buffer = "",
    friends = [],
    users = {},
    statuses = {},
    searches = [];

twttr.anywhere.config({
  assetHost: 'twitter-anywhere.s3.amazonaws.com'
});

var connect = function() {
  webSocket.connect();

  webSocket.addEvent('connect', function(){
    $("#status").html("connected");
  });
  
  webSocket.addEvent('close', function(){
    //
  });
  
  webSocket.addEvent('disconnect', function(){
    $("#status").html("lost connection..")
  });
  
  webSocket.addEvent('message', handle_message)
}

var disconnect = function() {
  alert("disconnected");
}

var handle_message = function(data){
    object = JSON.parse(data);
    console.log(object);
    
    switch(object.type) {
      case 'friends':
        friends = object.payload;
        break;
      case 'status':
        tweet(object.payload);
        break;
      case 'retweet':
        retweet(object.payload);
        break;
      case 'favorite':
        favorite(object.payload);
        break;
      case 'unfavorite':
        unfavorite(object.payload);
        break;
      case 'unfollow':
        unfollow(object.payload);
        break;
      case 'follow':
        follow(object.payload);
        break;
      case 'block':
        block(object.payload);
        break;
      default:
        // do nothing
      }
};    

var retweet = function(data){
  console.log('RETWEET');
  say("retweet", "@"+data.user.screen_name+" retweeted: @"+data.retweeted_status.user.screen_name+": "+auto_link(data.retweeted_status.text));
}

var tweet = function(data){
  console.log('TWEET');
  say("tweet", "<img style='height: 48px; width: 48px;' class='action_avatar' src='"+data.user.profile_image_url+"' alt='avatar for "+data.user.screen_name+"' /> <p class='tweet_content'>@"+data.user.screen_name+": "+auto_link(data.text)+"</p><p class='tweet_meta;>Tweeted at "+data.createdAt+"</p>");
}

var auto_link = function(text){
  opts = {'target': '_blank'};
  return TwitterText.auto_link_hashtags(TwitterText.auto_link_urls_custom(text, opts), opts);
}

var favorite = function(data){
  console.log('FAVORITE');
  // {"target":{"id":8438932},"source":{"id":46783},"target_object":{"id":12548122651},"event":"favorite"}
  // say(user(data.source.id).screenName +" favorited "+data.target_object.id);
  // id, createdAt, text, source, truncated, inReplyToStatusId, inReplyToUserId, favorited, inReplyToScreenName, geo
  if(users[data.source.id] && statuses[data.target_object.id]){
    var user = users[data.source.id];
    var favorited_user = statuses[data.target_object.id].user;
    var status = statuses[data.target_object.id]
    say("favorite", "@"+user.screenName+" favorited @"+favorited_user.screenName+": "+sub_say(auto_link(status.text)));
  }else{
    if(users[data.source.id]){
      find_status(data.target_object.id, function(){
        favorite(data);
      });
    }else if(statuses[data.target_object.id]){
      find_users([data.source.id], function(){
        favorite(data)
      });
    }else{
      
      find_users([data.source.id], function(){
        find_status(data.target_object.id, function(){
          favorite(data);
        });
      });
      
    }
  }
  
}

var unfavorite = function(data){
  console.log('UNFAVORITE');
  if(users[data.source.id] && statuses[data.target_object.id]){
    var user = users[data.source.id];
    var favorited_user = statuses[data.target_object.id].user;
    var status = statuses[data.target_object.id]
    say("unfavorite", "@"+user.screenName+" unfavorited @"+favorited_user.screenName+": "+sub_say(auto_link(status.text)));
  }else{
    if(users[data.source.id]){
      find_status(data.target_object.id, function(){
        unfavorite(data);
      });
    }else if(statuses[data.target_object.id]){
      find_users([data.source.id], function(){
        unfavorite(data)
      });
    }else{
      
      find_users([data.source.id], function(){
        find_status(data.target_object.id, function(){
          unfavorite(data);
        });
      });
      
    }
  }
}

var follow = function(data){
  // {"target":{"id":2087021},"source":{"id":28967048},"event":"follow"}
  console.log('FOLLOW');

  if(users[data.source.id] && users[data.target.id]){
    say("follow", "@"+users[data.source.id].screenName+" followed @"+users[data.target.id].screenName);
  }else{
    
    find_users([data.source.id, data.target.id], function(){
      follow(data);
    });
  }
}

var unfollow = function(data){
  // {"target":{"id":2087021},"source":{"id":28967048},"event":"follow"}
  console.log('UNFOLLOW');
  if(users[data.source.id] && users[data.target.id]){
    say("unfollow", data.source.id+" unfollowed "+data.target.id);
  }else{
    find_users([data.source.id, data.target.id], function(){
      unfollow(data);
    });
  }
}

var block = function(data){
  // {"target":{"id":2087021},"source":{"id":28967048},"event":"follow"}
  console.log('BLOCK');
  say("block", data.source.id+" blocked "+data.target.id);
}

var say = function(type, message) {
  var html = $("<li class='message_type_"+type+"'>"+message+"</li>");
  
  if(!show_message_type(type)){
    html.attr('style', "display:none;")
  }
  
  $("#stream").prepend(html);
  twttr.anywhere(function(T) {
    T("#stream").hovercards();
  });
}

var sub_say = function(message){
  return "<ul><li>" + message + "</li></ul>"
}

var find_status = function(status_id, callback){
  twttr.anywhere(function(T){
    T.Status.find(status_id, {'success': function(status){
      
      statuses[status.id] = status;
      
      callback();
    }});
  });      
}

var find_users = function(user_ids, callback) {
  var user_ids_to_find = [];
  $.each(user_ids, function(i, user_id){
    if(!users[user_id]) {
      user_ids_to_find.push(user_id)
    }
  });
  
  twttr.anywhere(function(T){
    T.User.findAll(user_ids_to_find, {'success': function(u){
      
      u.each(function(user){
        users[user.id] = user;
      });
      
      callback();
    }});
  });
  
}

var retrieve_saved_searches = function(u, callback){  
  
  u.savedSearches(function(s){
    callback(s.array);
  });
  
  

}

var change_search_terms = function(e){
  var terms = [];
  $('.search input:checked').each(function(e){
    terms.push($(this).val());
  });
  
  var terms = terms.join();
  
  webSocket.send(JSON.stringify({
    'method': 'new_search',
    'search': terms
  }));
}

var app = $.sammy(function() {
  this.element_selector = '#main';
  
  this.use(Sammy.Template);

  this.get('#/', function(context) {
    twttr.anywhere(function(T) {
      if (T.isConnected()) {
        connect();
        
        // get the saved searches
        retrieve_saved_searches(T.User.current(), function(s){
          var list = $('<ul></ul>').addClass('searches');
    
          $.each(s, function(i, search) {
            context.partial('templates/search.template', {search: search}, function(rendered) {
              list.append(rendered);
            });
          });
          
          $('#search_component').append(list);
        });
        
      } else {
        T('#login').connectButton({ authComplete: connect, signOut: disconnect });
        $("#login").show();
      }
    });
  });
  
});

var show_message_type = function(message_type){
  return $('#' + message_type + '_checkbox').is(':checked');
}

$(function() {
  app.run('#/');
  
  $("#stream_types input").change(function(e) {
    var $t = $(e.currentTarget),
        type = $t.val(),
        checked = $t.is(":checked");
    if(checked) { $(".message_type_"+type).fadeIn(); }
    else { $(".message_type_"+type).fadeOut(); }
  });
  
  $('.search input').change(change_search_terms);
});
    
})(jQuery);
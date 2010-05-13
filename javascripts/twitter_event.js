var sys = require('sys');

var TwitterEvent = function(db, callback) {
  this.init(db, callback);
};

TwitterEvent.prototype = {
  init: function(db, callback) {
    this.setupDb(db, function() {
      callback();
    });
  },

  setupDb: function(db, callback) {
    var self = this;
    db.createCollection('events', function(err, collection) {
      db.collection('events', function(err, collection) {
        self.collection = collection;
        sys.puts("in setupDb;");
        callback();
      });
    });
  },

  insertEvent: function(type, doc) {
    this.collection.insertAll([{type: type, payload: doc}]);
  },
  
  findEvents: function(limit, callback){
    this.collection.find(function(err, cursor){ callback(err, cursor) }, {'limit' : limit});
  }

};

exports.TwitterEvent = TwitterEvent;
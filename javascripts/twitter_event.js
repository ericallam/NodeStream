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

  insertEvent: function(doc) {
    sys.puts("======INSERTING NEW EVENT======");
    sys.puts(sys.inspect(doc));
    this.collection.insertAll([doc]);
  },

};

exports.TwitterEvent = TwitterEvent;
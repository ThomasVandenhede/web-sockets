const mongodb = require("mongodb");

const dbUrl = "mongodb://127.0.0.1:27017";

exports.connect = function(done) {
  mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true }, function(
    connErr,
    client
  ) {
    if (!connErr) {
      done(client);
    }
  });
};

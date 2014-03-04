var mongodb = require('mongodb');
var db = new mongodb.Db('exampleDb', new mongodb.Server('localhost', 27017, {}), {safe: true});


db.open(function(err, db) {
	if (!err) {
		console.log('open...');
		db.createCollection('widgets', function(err, collection) {
			collection.remove(null, function(err, result) {
				if (!err) {
					var widget1 = {id: 1, title: 'First', price: 313},
						widget2 = {id: 2, title: 'Second', price: 31},
						widget3 = {id: 3, title: 'Third', price: 66},
						widget4 = {id: 4, title: 'Four', price: 1};

					collection.insert([widget1,widget2,widget3,widget4], function(err, result) {
						if (err) {
							console.log(err);
						} else {
							collection.find().toArray(function(err, docs) {
								console.log(docs);
								db.close();
							});
						}
					});
				}
			});
		});
	}
});

console.log('maydan');
/*var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/test', function(err, db) {
  if(err) throw err;
  console.log("Connected to Database");
})


var MongoClient = require('mongodb').MongoClient,
     format = require('util').format;

  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });
    });
  })

















/*var mongo = require('mongodb');

var database = new mongo.Db('test', new mongo.Server('localhost', 27017, {}), {safe:false});
database.open(function(err, database) {
	if (!err) {
		database.createCollection('users', function(err, collection) {
			if (!err) {
				var user1,user2 = {
						name: 'Василий',
						password: 'vasa'
					};

				collection.insert([user1,user2], {safe: true}, function(err, result) {
					if (err) {
						console.log(err);

					} else {
						collection.find().toArray(function(err, docs) {
							console.log(docs);
							database.close();
						})
												
					}
				});
			}
		});
	}
});
*/
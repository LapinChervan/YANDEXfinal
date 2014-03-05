var newUser = require('./User');
var util = require('util'),
	mongodb = require('mongodb'),
	db = new mongodb.Db('exampleDb', new mongodb.Server('localhost', 27017, {}), {safe: true});

var requests = (function() {
	
	function reg(user, password) {
		db.open(function(err, db) {
			if (!err) {
				console.log('open...');
				db.createCollection('users', function(err, collection) {
					collection.remove(null, function(err, result) {
						if (!err) {	
							collection.insert(new newUser(), function(err, result) {
								if (err) {
									console.log(err);
								} else {
									
									collection.find().toArray(function(err, docs) {
										console.log(util.inspect(docs));
										db.close();
									});
								}
							});
						}
					});
				});
			}
		});
	}

	return {
		reg: reg
	}
})();

module.exports = requests;
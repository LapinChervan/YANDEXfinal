var http = require('http'),
	url = require('url'),
	util = require('util'),
	mongodb = require('mongodb'),
	db = new mongodb.Db('exampleDb', new mongodb.Server('localhost', 27017, {}), {safe: true}),
	data;
http.createServer(function(req, res) {


	var urlParsed = url.parse(req.url, true);
	if (urlParsed.pathname == '/echo') {

		

db.open(function(err, db) {
	if (!err) {
		console.log('open...');
		db.createCollection('widgets', function(err, collection) {
			collection.remove(null, function(err, result) {
				if (!err) {
					var echo = {name: 'echoObject', status: 'YEESSSSS'};
						
					collection.insert(echo, function(err, result) {
						if (err) {
							console.log(err);
						} else {
							
							collection.find().toArray(function(err, docs) {
								data = docs;
								db.close();
							});
						}
					});
				}
			});
		});
	}
});
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
	res.end(util.inspect(data));
}	

	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
	res.end('Сервер не может отдать ');
	
}).listen(1111);
var http = require('http'),
	url = require('url'),
	util = require('util');
	requests = require('./requests'),
	querys = requests;
	
http.createServer(function(req, res) {
	console.log('Вижу реквест');
	querys.reg('Вася','пароль');
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
	res.write('Сервер не может отдать ');
	res.end();
	
}).listen(1111);



/*

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
	//res.end(util.inspect(data));
	res.end('ДА ЕСТЬ ЖЕЖ')
}	
*/



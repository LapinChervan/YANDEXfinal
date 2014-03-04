var http = require('http');

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
	res.write('Привет мир!!!');
	res.end();
}).listen(1111);
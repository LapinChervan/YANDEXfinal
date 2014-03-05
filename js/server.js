var http = require('http'),
	url = require('url'),
	util = require('util');
	requests = require('requests');
	
http.createServer(function(req, res) {
	var data = url.parse(req.url, true);

	if (data.pathname === '/reg') {
		requests.reg(data.query.login, data.query.password);
		res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
		res.end();
	}

    if (data.pathname === '/auth') {
        requests.auth(data.query.login, data.query.password, res);
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
       // res.end();
    }
	
}).listen(1111);


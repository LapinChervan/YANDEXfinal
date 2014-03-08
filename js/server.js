var http = require('http'),
	url = require('url'),
	util = require('util');
	requests = require('requests');
	
http.createServer(function(req, res) {
	var data = url.parse(req.url, true);

	if (data.pathname === '/reg') {
		requests.reg(data.query.login, data.query.password);

		res.end();
	}

    if (data.pathname === '/auth') {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
        requests.auth(data.query.login, data.query.password, res);

       // res.end();
    }

    if (data.pathname === '/currency') {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
        if (data.query.curr) {
            requests.changeCurr(data.query.login, data.query.curr, res);
        }
        else {
            requests.setMainCurr(data.query.login, data.query.valuta, res);
        }
    }
	
}).listen(1111);


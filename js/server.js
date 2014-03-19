var http = require('http'),
	url = require('url'),
	util = require('util');
	requests = require('requests');
	
http.createServer(function(req, res) {
	var data = url.parse(req.url, true);

    var pathObj = {
        '/reg': function() {
            requests.reg(data.query.login, data.query.password);
        },

        '/auth': function() {
            requests.auth(data.query.login, data.query.password, data.query.start, data.query.end, res);
        },

        '/currency': function() {
            if (data.query.curr) {
                requests.changeCurr(data.query.login, data.query.curr, res);
            }
            else {
                requests.setMainCurr(data.query.login, data.query.valuta, res);
            }
        },

        '/newCategories': function() {
            requests.newCat(data.query.login, data.query.typ, data.query.cat, res);
        },

        '/historyNewOper': function() {
            requests.newOper(data.query.login, data.query.type, data.query.formData, res);
        },

        '/historyRemove': function() {
            requests.removeOper(data.query.login, data.query.type, data.query.id, data.query.json, res);
        },

        '/renameCategory': function() {
            var obj = {
                login: data.query.login,
                type: data.query.type,
                old: data.query.old,
                new: data.query.new
            };
            requests.renameCat(obj, res);
        },
        '/removeCategory': function() {
            requests.removeCat(data.query.login, data.query.type, data.query.old, res);
        },
        '/findOperation': function() {
            if (data.query.start) {
                requests.dateFilter(data.query.login, data.query.start, data.query.end, res);
            }
            else {
                requests.historyFilter(data.query.login, data.query.account, res, data.query.type);
            }
        }
    };

    if (pathObj[data.pathname]) {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
        pathObj[data.pathname]();
    }

}).listen(1111);

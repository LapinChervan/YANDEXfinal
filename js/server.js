var http = require('http'),
	url = require('url'),
	util = require('util'),
    connect = require('connect'),
	requests = require('requests');

var app = connect()
    .use(connect.cookieParser())
    .use(function(req, res, next){
        var data = url.parse(req.url, true);
            pathObj = {
                '/reg': function() {
                    requests.reg(data.query.login, data.query.password, res);
                },

                '/auth': function() {
                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*','Set-Cookie':'name=value;'});
                    requests.auth(data.query.login, data.query.password, data.query.start, data.query.end, res);
                },

                '/currency': function() {
                    if (data.query.curr) {
                        requests.changeCurr(data.query.login, data.query.curr, data.query.price, res);
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
                    requests.removeOper(data.query.login, data.query.type, data.query.id, res);
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
                    if (!data.query.account) {
                        requests.dateFilter(data.query.login, data.query.start, data.query.end, res);
                    }
                    else {
                        requests.historyFilter(data.query.login, data.query.account, res, data.query.type, data.query.start, data.query.end);
                    }
                }
            };
        if (pathObj[data.pathname]) {
            if (data.pathname !== '/auth') {
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8', 'Access-Control-Allow-Origin': '*'});
            }
            pathObj[data.pathname]();
        } else {
            next();
        }
    });
    app.use(connect.static('/Users/1/Documents/GitHub/yandex'));
http.createServer(app).listen(1111);

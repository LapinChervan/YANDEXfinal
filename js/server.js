var http = require('http'),
    url = require('url'),
    util = require('util'),
    connect = require('connect'),
    requests = require('requests'),
    app = connect()
    .use(connect.cookieParser())
    .use(function(req, res, next){
        var data = url.parse(req.url, true),
            pathObj = {
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
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            console.log(req.headers);
            pathObj[data.pathname]();
        } else {
            next();
        }
    });

    app.use(function(req, res, next) {
        // if (req.headers.origin === 'http://habrahabr.ru') {
        var data = url.parse(req.url, true);
        if (data.pathname === '/auth') {
        //    var crypto = require('crypto');
         //   console.log(crypto.createHash('md5').update(data.query.login + data.query.password + Date.parse(new Date())).digest("hex"));
        //    var date = new Date();
          //  date.setTime(date.getTime()+(7*24*60*60*1000));
          //  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8','Set-Cookie':'zalupa='+crypto.createHash('md5').update(data.query.login + data.query.password + Date.parse(new Date())).digest("hex")+';path=/;expires='+date.toGMTString()+';HttpOnly'});
            requests.auth(data.query.login, data.query.password, data.query.start, data.query.end, res);
        }
        //   }
        else {
            next();
        }
    });
    app.use(function(req, res, next) {
        // if (req.headers.origin === 'localhost:1111') {
        var data = url.parse(req.url, true);
        if (data.pathname === '/reg') {
            res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
            requests.reg(data.query.login, data.query.password, res);
        }
        // }
        else {
            next();
        }
    });

    app.use(connect.static('/Users/1/Documents/GitHub/yandex'));
http.createServer(app).listen(1111);

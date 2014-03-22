var connect = require('connect'),
	http = require('http');
var app = connect()
		.use(connect.logger('dev'))
		.use(connect.cookieParser())
		.use(function(req,res,next){
			console.log(req);
			next();
		})
		.use(connect.static('/Users/1/Documents/GitHub/yandex'));
http.createServer(app).listen(8124);
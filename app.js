var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

//设置session的模块
var flash=require("connect-flash");
var session=require("express-session");

var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all('*', function(req, res, next) {
  var oriRefer;
  if(req.headers.referer){
    oriRefer= req.headers.referer.substring(0,req.headers.referer.indexOf("/",10));
  }
  // var MIME_TYPE = {
  //   "css": "text/css",
  //   "gif": "image/gif",
  //   "html": "text/html",
  //   "ico": "image/x-icon",
  //   "jpeg": "image/jpeg",
  //   "jpg": "image/jpeg",
  //   "js": "text/javascript",
  //   "json": "application/json",
  //   "pdf": "application/pdf",
  //   "png": "image/png",
  //   "svg": "image/svg+xml",
  //   "swf": "application/x-shockwave-flash",
  //   "tiff": "image/tiff",
  //   "txt": "text/plain",
  //   "wav": "audio/x-wav",
  //   "wma": "audio/x-ms-wma",
  //   "wmv": "video/x-ms-wmv",
  //   "xml": "text/xml"
  // };
  // var filePath;
  // if(req.url==="/"){
  //   filePath =  "index.html";
  // } else if(req.url==="/www/"){
  //   filePath =  "index.html";
  // }else{
  //   filePath = "./" + url.parse(req.url).pathname;
  // }
  // var ext = path.extname(filePath);
  // ext = ext?ext.slice(1) : 'unknown';
  // var contentType = MIME_TYPE[ext] || "text/plain";
  res.header("Access-Control-Allow-Origin", oriRefer?oriRefer:"*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  // res.header("X-Powered-By",' 3.2.1')
  // res.header("Content-Type", contentType+";charset=utf-8");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(session({
	name:"tyyp",//	设置cookie的名称默认:connect.sid
	secret:"tyyp",//加密字符串
	cookie:{maxAge:800000000},//设置cookie过期时间
	resave:false,
	saveUninitialized:false//每次请求是否初始化
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

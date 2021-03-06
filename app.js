var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
// TODO 這邊要加上 whitelist 來控管誰可以對這個 enode 下指令
var ethereum = require('./routes/ethereum');
var contract = require('./routes/contract');
var health = require('./routes/health');
var explorer = require('./routes/explorer');
var account = require('./routes/account');

var app = express();
var version = '/v1';
var ethereumPath = '/eth';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// for swagger ui
app.use('/swagger', express.static(path.join(__dirname, 'swagger')));

// for web page
app.use('/', index);
// for rest APIs
app.use(version + ethereumPath + '/contract', contract);
app.use(version + ethereumPath + '/explorer', explorer);
app.use(version + ethereumPath, ethereum);
app.use(version + '/health', health);
app.use(version + '/account', account)

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

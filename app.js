var createError = require('http-errors');
var express = require('express');
var http = require('http'); // Add the http module
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');

var app = express();

var server = http.createServer(app); // Create an HTTP server using Express

var io = socket_io({ wsEngine: 'ws' });
app.io = io;

var indexRouter = require('./routes/index')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Listen on port 8000
server.listen(8000, function () {
  console.log('Server is listening on port 8000');
});

module.exports = app;

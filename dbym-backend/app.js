var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
{
  //var cookieParser = require('cookie-parser');
  //var logger = require('morgan');
}

// 구글맵프로젝트 ID
// projectdbym-1531465007286
// 프로젝트 번호
// 1046259602801
// 제오코딩api : AIzaSyAD7kLRbH0UwpPTNszDx72Fui47lvGjl5w
//https://maps.googleapis.com/maps/api/geocode/json?address=화정역+3호선&key=AIzaSyAD7kLRbH0UwpPTNszDx72Fui47lvGjl5w

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

{
  //mongo db connect
  // var mongoose = require('mongoose');
  // const DB_URL = `mongodb://syaring:kim92918@ds135061.mlab.com:35061/dbym-db`;
  // mongoose.connect(DB_URL, { useNewUrlParser: true });

  // var DB = mongoose.connection;

  // DB.once('open', function () {
  //   console.log('connected to ' + DB_URL);
  // });

  // var newSchema = new mongoose.Schema({
  //   uid: Number,
  //   user_fbid: String,
  //   user_name: String,
  //   user_email: String,
  //   user_friends: Array[String]
  // });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

{ 
  // app.use(logger('dev'));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

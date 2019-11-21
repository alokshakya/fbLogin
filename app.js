var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade'); 



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//initializing passport for jwt
var passport = require('passport');
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//connecting to mognodb using mongoose model

const mongoose = require('mongoose');
const config = require('./config');
const mongoUrl = config.mongoUrl;
const connect = mongoose.connect(mongoUrl,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true
});

connect.then( (db) => {
  console.log('Connected correctly to mongoDB database');
}, (err) => { console.log(err)});

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

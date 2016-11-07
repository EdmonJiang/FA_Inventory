var express = require('express'),
    compression = require('compression'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Pclog = require('./models/pclog.js'),
    configDB = require('./config/database.js'),
    api = require('./dell/api.js');
mongoose.Promise = global.Promise = require('bluebird');
mongoose.connect(configDB.uri);
api.scheduleSync();

var routes = require('./routes/index'),
    reports = require('./routes/reports'),
    statistics = require('./routes/statistics'),
    charts = require('./routes/charts'),
    logs = require('./routes/logs'),
    organization = require('./routes/organization'),
    users = require('./routes/users'),
    servicetag = require('./routes/servicetag');

var app = express();

//var rootFolder = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(compression());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res,next){
  app.locals.currentUrl = req.path;
  app.locals.moment = moment;
  //res.locals.rootFolder = rootFolder;
  next();
});

app.use('/', routes);
app.use('/reports', reports);
app.use('/statistics', statistics);
app.use('/charts', charts);
app.use('/logs', logs);
app.use('/organization', organization);
app.use('/servicetag', servicetag);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found.');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if(err.status){
    res.status(err.status);
  }else{
    err.status = 500;
    err.message = "Internal Server Error."
    res.status(500);
  }
  res.render('404', {error: err});
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var config=require('./config/config');

var api=require('./api/api');


require('mongoose').connect(config.db.url);



var app = express();


require('./middleware/appMiddleware')(app);


app.use('/api',api);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  
  let error = req.app.get('env') === 'development' ? err : {};


  console.log(error.message);
  
  // render the error page
  res.status(err.status || 500);
  res.json({'error':error.message});
});

module.exports = app;

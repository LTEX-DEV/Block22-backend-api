
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');

module.exports=function(app){

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

}
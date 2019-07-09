var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');

var authRouter = require('./tms/routers/auth')
var apiRouter = require('./tms/routers/apis')

var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}));
app.use('/ue/auth', authRouter)
app.use('/ue/api', apiRouter)

module.exports = app;
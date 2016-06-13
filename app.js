// Module dependencies
var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appConfig = require('./api/appConfig');
var debug = require('debug')('kick4fun:server');

// configuration
var port = appConfig.PORT || 3000;
var appPath = appConfig.APP_PATH || '/';
var mongoUrl = appConfig.MONGO_URL || 'localhost:27017';

// init express app
var app = express();
app.set('port', port);

// app dependencies
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// client route
app.use(express.static("./client"));
app.get(appPath, function(request, result) {
    result.sendFile("./client/index.html", { root: __dirname });
});

// load mongoose models in correct order (inherited models)
require('./api/models/counter');
require('./api/models/tournament');
require('./api/models/challenge');
require('./api/models/level');
require('./api/models/match');
require('./api/models/standing');
require('./api/models/stats');
require('./api/models/participantstats');

// express routes
var routes = require('./api/routes');
app.use(appPath + 'api', routes);

// connect to Mongo DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + mongoUrl);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
    console.log('Connected to MongoDB at ' + mongoUrl);
});

// init HTTP server
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function (error, request, response, next) {
    response.status(error.status || 500).send({errors:[{internalMessage: error.message}]});
});

// utilities

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error('Port' + port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('Port' + port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    debug('Listening on port' + server.address().port);
}

module.exports = app;

// Module dependencies
var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appConfig = require('../appConfig');
var utils = require('./utils');
var debug = require('debug')('kick4fun:server');

// init express app
var app = express();
var port = utils.normalizePort(appConfig.REST_PORT);
app.set('port', port);

// app dependencies
//app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(appConfig.CLIENT_APP_PATH));

//app.get('/', function(request, result) {
//    result.sendFile(appConfig.CLIENT_APP_PATH + appConfig.CLIENT_PAGE);
//});

// load mongoose models in correct order (inherited models)
require('./models/counter');
require('./models/tournament');
require('./models/challenge');
require('./models/level');
require('./models/match');
require('./models/standing');
require('./models/stats');
require('./models/participantStats');

// express routes
var routes = require('./routes');
app.use('/api', routes);

// connect to Mongo DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + appConfig.MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
    console.log('Connected to MongoDB at ' + appConfig.MONGO_URL);
});

// init HTTP server
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
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
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./utils/db/db');

// Create Express application
var app = express();

// Allow cross-domain middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(favicon('../client/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(cookieParser());

// Provide api routes
app.use(require('./api/api'));


// Serve client side files
app.get('/', (req, res) => res.render(path.join(__dirname, '../client/export/index.html')));
app.use(express.static('../client/export/'));

// Serve media files
app.use('/public', express.static(path.join(__dirname, './public')));

// Set application port
app.set('port', process.env.PORT || 9005);

// Connect to db
db.connect();

// Listen to port
var server = app.listen(app.get('port'), function() {
    console.log(`Express server listening on port ${server.address().port}`);
});

module.exports = app;
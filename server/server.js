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

// Serve index and config.js
// app.get('/', (req, res) => res.render('../../client/index.html')); // index stored in server (./views)
app.get('/', (req, res) => res.render('index.html')); // index stored in client
app.get('/config.js', (req, res) => res.sendFile(path.join(__dirname, '../client/config.js')));

// Serve client static files
// app.use(express.static(path.join(__dirname, '../client')));
app.use('/dist', express.static(path.join(__dirname, '../client/dist')));
app.use('/jspm_packages', express.static(path.join(__dirname, '../client/jspm_packages')));
app.use('/styles', express.static(path.join(__dirname, '../client/styles')));
app.use('/media', express.static(path.join(__dirname, '../client/media')));


// Serve media files
app.use('/public', express.static(path.join(__dirname, './public')));


// Set application port
app.set('port', process.env.PORT || 9000);

// Connect to db
db.connect();

// Listen to port
var server = app.listen(app.get('port'), function() {
    console.log(`Express server listening on port ${server.address().port}`);
});

module.exports = app;
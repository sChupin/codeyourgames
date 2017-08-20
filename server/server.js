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

// Express middleware
app.engine('html', require('ejs').renderFile);
app.use(favicon('../client/export/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(allowCrossDomain);
app.use(cookieParser());

// Provide api routes
app.use(require('./api/api'));

// Serve index and config.js
app.get('/', (req, res) => res.render(path.join(__dirname, '../client/export/index.html')));
app.get('/config.js', (req, res) => res.sendFile(path.join(__dirname, '../client/export/config.js')));

// Serve client/export static files
app.use('/dist', express.static(path.join(__dirname, '../client/export/dist')));
app.use('/jspm_packages', express.static(path.join(__dirname, '../client/export/jspm_packages')));
app.use('/assets', express.static(path.join(__dirname, '../client/export/assets')));

// Serve media files
app.use('/public', express.static(path.join(__dirname, './public')));


// Set application port
app.set('port', process.env.PORT || 9000);

// Connect to db
db.connect(() => {
    db.populateDb();

    // Listen to port
    var server = app.listen(app.get('port'), function() {
        console.log(`Express server listening on port ${server.address().port}`);
    });
});


module.exports = app;
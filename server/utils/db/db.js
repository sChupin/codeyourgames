var mongoose = require('mongoose');

var schema = require('./schema');

var dbpath = 'mongodb://localhost/test';

// Set up the connection to the database
exports.connect = function() {
    mongoose.connect(dbpath);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Connected to mongoDB via mongoose module!');
    });
    db.once('close', console.log.bind(console, 'Connection closed!'));
    process.on('SIGINT', function() {
        db.close();
        process.exit(0);
    });
}

exports.retrieveItem = function(coll, query, proj, callback) {
    var db = mongoose.connection;
    if (db !== undefined) {
        if (query === undefined) {
            query = {};
        }
        if (proj === undefined) {
            proj = {};
        }
        db.collection(coll).find(query, proj).toArray(function(err, results) {
            if (err) {
                callback(err, undefined);
            } else {
                callback(false, results);
            }
        });
    } else {
        callback(true, undefined);
    }
}

exports.retrieveUniqueItem = function(coll, query, callback) {
    var db = mongoose.connection;
    if (db !== undefined) {
        db.collection(coll).findOne(query)
            .then(document => {
                if (document !== undefined) {
                    callback(false, document);
                } else {
                    callback(false, undefined);
                }
            });
    } else {
        callback(true, undefined);
    }
}
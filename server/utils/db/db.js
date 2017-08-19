var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var imgSize = require('image-size');

var schema = require('./schema');

if (process.env.APP_CONFIG) {
    const config = JSON.parse(process.env.APP_CONFIG);
}

var dbpath = '';

if (process.env.APP_CONFIG) {
    var mongoPassword = 'B5hAY8qkhwufb8US';
    dbpath = 'mongodb://' + config.mongo.user + ':' + mongoPassword + '@' + config.mongo.hostString;    
} else {
    dbpath = 'mongodb://localhost/test';
}

// Set up the connection to the database
exports.connect = function(callback) {
    console.log('Connecting to database...')
    mongoose.connect(dbpath);
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function() {
        console.log('Connected to mongoDB via mongoose module!');
        callback();
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

exports.populateDb = function() {
    console.log('Inserting images into database...');

    const baseURL = 'http://localhost:9000/public/images/';
    const imagesPath = path.join(__dirname, '../../public/images/');

    var db = mongoose.connection;

    // Read all dir in public/images
    var cb = function() {
        fs.readdir(imagesPath, (err, dirs) => {
            if (err) {
                console.log('error reading directories');
                process.exit(0);
            }

            // For each dir, insert all images in db
            dirs.forEach(dir => {
                let gallery = {sectionName: dir, images: []};
                
                // Read all files in current dir
                fs.readdir(path.join(imagesPath, dir, '/'), (err, files) => {
                    if (err) {console.log('error reading files'); process.exit(0);}

                    // For each file, insert it in db
                    files.forEach(file => {
                        // ignore subfolders
                        if (file.match(/.*\.png/i)) {
                            
                            let image = {
                                name: file.slice(0, -4),
                                url: baseURL + dir + '/' + file
                            };

                            if (dir == "Sprites") {
                                let sheetSize = imgSize(path.join(imagesPath, dir, '/sheets/', file));
                                let spriteSize = {width: sheetSize.width/4, height: sheetSize.height/4};
                                let sheetUrl = baseURL + dir + "/sheets/" + file;
                                image.spritesheet = {sheetUrl: sheetUrl, spriteWidth: spriteSize.width, spriteHeight: spriteSize.height, horizontalNbr: 4, verticalNbr: 4, spriteNbr: 16, defaultSpriteNo: 0};
                            }

                            gallery.images.push(image);
                        }
                    });

                    db.collection('imggalleries').insertOne(gallery);
                });
            });
        });
    }

    db.collection('imggalleries').count().then(length => {
        if (length > 0) {
            db.collection('imggalleries').drop().then(cb);
        } else {
            cb();
        }
    });
    
    console.log('Database populated with images.');
}
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var schema = require('./schema');

// Connect to db
var dbpath = 'mongodb://localhost/test';
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

const baseURL = 'http://localhost:9000/public/images/';


// Read all dir in public/images
// For each dir, insert all images in db
const imagesPath = path.join(__dirname, '../../public/images/');
fs.readdir(imagesPath, (err, dirs) => {
    if (err) {console.log('error reading directories'); process.exit(0);}
    dirs.forEach(dir => {
        let gallery = {sectionName: dir, images: []};
        fs.readdir(path.join(imagesPath, dir, '/'), (err, files) => {
            if (err) {console.log('error reading files'); process.exit(0);}
            files.forEach(file => {
                console.log('ok');
                gallery.images.push({name: file.slice(0, -4), url: baseURL + dir + '/' + file});
                if (gallery.images.length === files.length) {
                    db.collection('imggalleries').insertOne(gallery);
                    db.close();
                }
            });
        });
    });
});
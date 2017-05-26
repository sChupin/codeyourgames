var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var imgSize = require('image-size');

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




const imagesPath = path.join(__dirname, '../../public/images/');

// Read all dir in public/images
fs.readdir(imagesPath, (err, dirs) => {
    if (err) {console.log('error reading directories'); process.exit(0);}

    // For each dir, insert all images in db
    dirs.forEach(dir => {
        let gallery = {sectionName: dir, images: []};
        
        // Read all files in current dir
        fs.readdir(path.join(imagesPath, dir, '/'), (err, files) => {
            if (err) {console.log('error reading files'); process.exit(0);}

            // For each file, insert it in db
            files.forEach(file => {
                console.log('ok');
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
            db.close();
        });
    });
});
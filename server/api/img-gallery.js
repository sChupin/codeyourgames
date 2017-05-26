var http = require('http');
var htmlparser = require('htmlparser2');
var path = require('path');

var db = require('../utils/db/db');

const imgServer = 'www.untamed.wild-refuge.net';

var options = {
    host: imgServer,
    path: '/images/rpgxp/single/',
    port: 80,
    method: 'GET'
}

var dest = path.join(__dirname, '../public/images/');
/*
    let getGallery = function(req, res) {
        var imgList;
        
        http.request(options, function(response) {
            var str = '';
            response.on('data', function(chunk) {
                str += chunk;
            });

            response.on('end', function() {
                res.send(getImgList(str));
            });
        }).end();    
    };

    exports.getGallery = getGallery;
*/

let getGalleries = function(req, res) {
    db.retrieveItem('imggalleries', {sectionName: { $ne: 'Backgrounds' } }, {sectionName: 1, _id: 0}, function(err, sectionNames) {
        if (!err) {
            if (sectionNames !== undefined && sectionNames.length > 0) {
                let names = [];
                sectionNames.forEach(function(name) {
                    names.push(name.sectionName);
                }, this);
                res.type('application/json').status(200).json(names);                                
            }
            else {
                res.type('application/json').status(404).json({});
            }
        } else {
            console.log(err);
            res.status(505).end('Internal error: No database connection');
        }
    });
}
exports.getGalleries = getGalleries;

let getGalleryBySection = function (req, res) {
    let section = req.params.id;
    let query = {sectionName: section};
    db.retrieveUniqueItem('imggalleries', query, function(err, gallery) {
        if (!err) {
            if (gallery !== undefined) {
                res.type('application/json').status(200).json(gallery.images);
            } else {
                res.status(404).end('Bad request: no such gallery named ' + section);
            }
        } else {
            console.log(err);
            res.status(505).end('Internal error: No database connection');
        }
    });
}
exports.getGalleryBySection = getGalleryBySection;

function getImgUrlList(imgList, spriteSheetList, url, str) {
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            // If href link
            if (name === "a") {
                var href = attribs.href;
                // if img
                if (href.match(/.*\.png/i)) {
                    let imgUrl = url + "single/" + attribs.href;
                    let spriteSheetUrl = url + attribs.href;
                    imgList.push({"url": url});
                    spriteSheetList.push({"url": spriteSheetList});
                } else if (href.match(/.*\//)) {
                    // recursive call on directories
                    getImgList(imgList, spriteSheetList, url + href);
                }
            }
        }
    });

    parser.write(str);
    parser.end();

    return imgList;
}
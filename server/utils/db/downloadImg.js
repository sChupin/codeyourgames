var request = require('request');
var htmlparser = require('htmlparser2');
var fs = require('fs');
var path = require('path');

const serverBaseUrl = "http://untamed.wild-refuge.net/images/rpgxp/";

downloadImg = function(url, single) {
    request(url, function(err, res, body) {
        if (single) {
            parseSingle(url, body);
        } else {
            parseFolder(url, body);
        }
    });
}

parseFolder = function(url, body) {
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            // If href link
            if (name === "a") {
                var href = attribs.href;
                // if single/ folder
                if (href.match(/single\//)) {
                    downloadImg(url + href, true);
                } else if (href.match(/.+\//) && !href.includes("images")) {
                    // recursive call on directories
                    //downloadImg(url + href, false);
                    // img corrupted...
                }
            }
        }
    });

    parser.write(body);
    parser.end();
}

parseSingle = function(url, body) {
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            if (name === "a") {
                var href = attribs.href;
                if (href.match(/.*\.png/i)) {
                     // let imgUrl = url + "single/" + attribs.href;
                    // let spriteSheetUrl = url + attribs.href;
                    // imgList.push({"url": url});
                    // spriteSheetList.push({"url": spriteSheetList});
                    let completeUrl = url + href;
                    //console.log(completeUrl);
                    //console.log(completeUrl.replace("single/", ""));
                    console.log();
                    // request.get({url: completeUrl, encoding: 'binary'}, function (err, response, body) {
                    // fs.writeFile(path.join(__dirname, "../../public/images/Sprites/", href), body, 'binary', function(err) {
                    //     if(err)
                    //         console.log(err);
                    //     else
                    //         console.log("The file was saved!");
                    //     }); 
                    // });

                    request.get({url: completeUrl.replace("single", ""), encoding: 'binary'}, function (err, response, body) {
                    fs.writeFile(path.join(__dirname, "../../public/images/Sprites/sheets/", href), body, 'binary', function(err) {
                        if(err)
                            console.log(err);
                        else
                            console.log("The file was saved!");
                        }); 
                    });                    
                }
            }
        }
    });

    parser.write(body);
    parser.end();
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

downloadImg(serverBaseUrl, false);
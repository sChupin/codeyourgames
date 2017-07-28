var request = require('request');
var htmlparser = require('htmlparser2');
var fs = require('fs');
var path = require('path');

function parseHtmlColor(htmlFile) {
    var inAnchorTag = false;
    var colorName = false;
    var classBody = '';

    var colorParser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            if (name === 'a' && attribs.target !== undefined) {
                inAnchorTag = true;
                colorName = !colorName;
            }
        },
        ontext: function(text) {
            if (inAnchorTag) {
                if (colorName) {
                    classBody += '  static ' + text + ': string = ';
                } else {
                    classBody += "'" + text + "'" + ';\n';
                }
            }
        },
        onclosetag: function(name) {
            if (name === 'a') {
                inAnchorTag = false;
            }
        }
    });

    classBody += 'export class Color {\n';
    colorParser.write(htmlFile);
    colorParser.end();
    classBody += '}\n';
    return classBody;
}

var htmlFile = fs.readFileSync(path.join(__dirname, 'htmlColor.txt'));

var colorClass = parseHtmlColor(htmlFile);

fs.writeFileSync(path.join(__dirname, 'colorClass.txt'), colorClass);

    
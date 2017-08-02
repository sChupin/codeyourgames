var commentParser = require("comment-parser");
var through = require("through2");
var gutil = require("gulp-util");

var readJsdoc = function(opts) {
    return through.obj(function(file, enc, callback) {
        var self = this;
        if (file.isNull() || file.isDirectory()) {
            // Skip files with no content, and take them out of the loop.
            // self.push(file);
            return callback();
        } else if (file.isStream()) {
            self.emit("error", new gutil.PluginError({
                plugin: "readMyComments",
                message: "Streams are not supported."
            }));
            return callback();
        } else if (file.isBuffer()) {
            var parsed = commentParser(file.contents.toString());
            var condensed = JSON.stringify(docToSpriteType(parsed), null, 2);
            // var condensed = parsed.map(function(item) {
            //     return item.source;
            // }).join("\n\n\n").trim();
            if (condensed) {
                // If we have content, and only if we have content, re-add the
                // file to the set and make it available.
                file.contents = new Buffer(condensed, "utf-8");
                self.push(file);
            }
            return callback();
        } else {
            self.emit("error", new gutil.PluginError({
                plugin: "readMyComments",
                message: "Reached end of logic block. Shouldn't get here.."
            }));
        }
    });
};

function docToSpriteType(doc) {
    var spriteTypes = {};
    doc.forEach(function (comment) {
        var tags = comment.tags;
        // Check if it's a class comment
        var classTag = tags.find(function (tagLine) { return tagLine.tag == 'class'; });
        if (classTag) {
            var spriteTypeName = classTag.name;
            // Set SpriteType name and description
            var spriteType = { name: spriteTypeName, descr: comment.description, private: false, properties: [], events: [], methods: [] };
            spriteTypes[spriteTypeName] = spriteType;
            // Fill SpriteType properties and events
            tags.forEach(function (tag) {
                if (tag.tag == 'property') {
                    var property = { name: tag.name, type: tag.type, descr: tag.description, defVal: tag["default"] };
                    spriteType.properties.push(property);
                }
                else if (tag.tag == 'event') {
                    var event = { name: tag.name, descr: tag.description };
                    spriteType.events.push(event);
                }
                else if (tag.tag == 'private') {
                    spriteType.private = true;
                }
            });
        }
        else {
            // It's a method comment
            var className = tags.find(function (tagLine) { return tagLine.tag == 'memberof'; }).name;
            var method = { name: '', descr: comment.description, params: [], "return": { type: '', descr: '' } };
            tags.forEach(function (tag) {
                switch (tag.tag) {
                    case 'method':
                        method.name = tag.name;
                        break;
                    case 'return':
                        method["return"].type = tag.type;
                        method["return"].descr = tag.description;
                        break;
                    case 'param':
                        method.params.push({ name: tag.name, type: tag.type, descr: tag.description });
                        break;
                    default:
                        break;
                }
            });
            spriteTypes[className].methods.push(method);
        }
    });
    
    return spriteTypes;
}

module.exports = readJsdoc;

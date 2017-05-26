var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    name: String,
    url: String,
    spritesheet: {type: {sheetUrl: String, spriteWidth: Number, spriteHeight: Number, horizontalNbr: Number, verticalNbr: Number, spriteNbr: Number, defaultSpriteNo: Number}, default: null}
});

var imgGallerySchema = mongoose.Schema({
    sectionName: String,
    images: [imageSchema]
});
exports.ImgGallery = mongoose.model('ImgGallery', imgGallerySchema);
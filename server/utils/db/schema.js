var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    name: String,
    url: String
});

var imgGallerySchema = mongoose.Schema({
    sectionName: String,
    images: [imageSchema]
});
exports.ImgGallery = mongoose.model('ImgGallery', imgGallerySchema);
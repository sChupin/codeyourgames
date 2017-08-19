var express = require('express');

var gallery = require('./img-gallery');

var transpiler = require('./transpiler');

var router = express.Router();

router.get('/api/img-gallery', gallery.getGalleries);
router.get('/api/img-gallery/:id', gallery.getGalleryBySection);
router.post('/api/transpiler/event', transpiler.parse);

module.exports = router;
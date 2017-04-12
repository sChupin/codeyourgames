var express = require('express');

var gallery = require('./img-gallery');

var router = express.Router();

router.get('/api/img-gallery', gallery.getGalleries);
router.get('/api/img-gallery/:id', gallery.getGalleryBySection);

module.exports = router;
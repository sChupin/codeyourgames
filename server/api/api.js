var express = require('express');

var gallery = require('./img-gallery');

var transpiler = require('./transpiler');

var router = express.Router();

router.get('/api/img-gallery', gallery.getGalleries);
router.get('/api/img-gallery/:id', gallery.getGalleryBySection);
router.post('/api/transpiler/event', transpiler.parseEvent);
router.post('/api/transpiler/function', transpiler.parseFunction);
router.post('/api/transpiler/collision', transpiler.parseCollision);

module.exports = router;
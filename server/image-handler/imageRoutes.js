const express = require('express');
const router = express.Router();
const { uploadAndResizeImage } = require('./uploadResize');
const { listImages } = require('./list');
const { removeImage } = require('./remove');

// Route to handle image upload and resizing
router.post('/image-handler/upload', uploadAndResizeImage);
router.get('/image-handler/list', listImages);
router.delete('/image-handler/:key', removeImage);

module.exports = router;
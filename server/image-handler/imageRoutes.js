const express = require('express');
const router = express.Router();
const { uploadAndResizeImage } = require('./imageService');

// Route to handle image upload and resizing
router.post('/upload', uploadAndResizeImage);

module.exports = router;
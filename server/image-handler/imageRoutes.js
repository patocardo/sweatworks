const express = require('express');
const router = express.Router();
const imageController = require('./imageController');

// Route to handle image upload and resizing
router.post('/upload', imageController.uploadAndResizeImage);

module.exports = router;
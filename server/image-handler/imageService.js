const { resize, save } = require('./imageController');

// Controller to handle image upload and resizing
const uploadAndResizeImage = async (req, res) => {
  try {
    const resized = await resize(req.file);
    const saved = await save(resized);
    res.status(200).json({ message: 'Image processed successfully', saved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process image', error: error.message });
  }
};

module.exports = { uploadAndResizeImage };
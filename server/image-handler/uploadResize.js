const { resize, save, local } = require('./imageController');

const isDevEnv = process.env.NODE_ENV === 'development';

const uploadAndResizeImage = async (req, res) => {
  try {
    const resized = await resize(req.file);
    const saved = isDevEnv ? await save(resized) : await local.save(resized);
    res.status(200).json({ message: 'Image processed successfully', saved });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process image', error: error.message });
  }
};

module.exports = { uploadAndResizeImage };

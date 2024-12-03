const { remove, local } = require('./imageController');

const isDevEnv = process.env.NODE_ENV === 'development';

const removeImage = async (req, res) => {
  try {
    const { key } = req.params;
    const removed = isDevEnv ? await remove(key) : await local.remove(key);
    res.status(200).json({ message: 'Image deleted successfully', removed });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
};

module.exports = { removeImage };

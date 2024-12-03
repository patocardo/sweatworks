const { list, local } = require('./imageController');

const isDevEnv = process.env.NODE_ENV === 'development';

const listImages = async (req, res) => {
  try {
    const images = isDevEnv ? await list() : await local.list();
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
};

module.exports = { listImages };

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

const imageRoutes = require('./imagesRoutes');
const { upload } = require('./imageSchema');

app.use('/images', upload.single('image'), imageRoutes);

// API endpoint example
app.get('/api/greet', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Handles any requests that don’t match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

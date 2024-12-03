import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/image-handler/list');
      setImages(response.data.images);
    } catch (error) {
      console.error('Error fetching images', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await axios.post('/image-handler/upload', formData);
      fetchImages(); // Refresh images after upload
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/image-handler/delete/${key}`);
      fetchImages(); // Refresh images after deletion
    } catch (error) {
      console.error('Error deleting image', error);
    }
  };

  return (
    <div>
      <h1>Image Gallery</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      <div className="image-gallery">
        {images.map((image) => (
          <div key={image.Key} className="image-card">
            <img src={`https://s3.amazonaws.com/${image.Bucket}/${image.Key}`} alt={image.Key} />
            <button onClick={() => handleDelete(image.Key)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;

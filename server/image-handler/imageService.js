const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

// Service to resize and save the image to S3
const resizeAndSave = async (file) => {
  const environment = process.env.ENVIRONMENT || 'staging';
  const bucketName = `${environment}-sweatworks-images`;

  // Resize the image using sharp
  const resizedImage = await sharp(file.buffer)
    .resize(300, 300) // Example resizing to 300x300
    .toFormat('jpeg')
    .toBuffer();

  // Upload to S3
  const params = {
    Bucket: bucketName,
    Key: `resized/${file.originalname}`,
    Body: resizedImage,
    ContentType: 'image/jpeg'
  };

  const result = await s3.upload(params).promise();
  return result;
};

module.exports = { resizeAndSave };
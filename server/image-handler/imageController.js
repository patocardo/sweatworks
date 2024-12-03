const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const sharp = require('sharp');

const resize = async (file) => {

  // Resize the image using sharp
  const resized = await sharp(file.buffer)
    .resize(300, 300) // Example resizing to 300x300
    .toFormat('jpeg')
    .toBuffer();

  return resized;

};

const save = async(file) => {
  const environment = process.env.ENVIRONMENT || 'staging';
  const bucketName = `${environment}-sweatworks-images`;

  const params = {
    Bucket: bucketName,
    Key: `resized/${file.originalname}`,
    Body: file,
    ContentType: 'image/jpeg'
  };

  const command = new PutObjectCommand(params);
  const result = await s3.send(command);
  return result;
}

module.exports = { resize, save };

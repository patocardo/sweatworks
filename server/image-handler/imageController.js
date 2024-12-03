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

const saveLocal = async (file) => {
  const environment = process.env.ENVIRONMENT || 'staging';
  const localDirectory = path.join(__dirname, '..', 'local-images', environment);

  // Ensure the local directory exists
  if (!fs.existsSync(localDirectory)) {
    fs.mkdirSync(localDirectory, { recursive: true });
  }

  const filePath = path.join(localDirectory, `resized-${file.originalname}`);

  // Write the file to the local directory
  await fs.promises.writeFile(filePath, file);

  return { message: 'Image saved locally', path: filePath };
};

const list = async () => {
  const environment = process.env.ENVIRONMENT || 'staging';
  const bucketName = `${environment}-sweatworks-images`;

  const command = new ListObjectsV2Command({ Bucket: bucketName });
  const result = await s3.send(command);
  return result.Contents;
};

const remove = async (key) => {
  const environment = process.env.ENVIRONMENT || 'staging';
  const bucketName = `${environment}-sweatworks-images`;

  const params = {
    Bucket: bucketName,
    Key: key
  };

  const command = new DeleteObjectCommand(params);
  const result = await s3.send(command);
  return result;
};

const environment = process.env.ENVIRONMENT || 'staging';
const localDirectory = path.join(__dirname, '..', 'local-images', environment);

const local = {
  save: async (file) => {
  
    // Ensure the local directory exists
    if (!fs.existsSync(localDirectory)) {
      fs.mkdirSync(localDirectory, { recursive: true });
    }
  
    const filePath = path.join(localDirectory, `resized-${file.originalname}`);
  
    // Write the file to the local directory
    await fs.promises.writeFile(filePath, file);
  
    return { message: 'Image saved locally', path: filePath };
  },
  list: async () => {

    // Ensure the local directory exists
    if (!fs.existsSync(localDirectory)) {
      return [];
    }

    const files = await fs.promises.readdir(localDirectory);
    return files.map((file) => ({ Key: file, Path: path.join(localDirectory, file) }));
  },
  remove: async (key) => {
    const filePath = path.join(localDirectory, key);

    // Ensure the file exists
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return { message: 'Image deleted successfully' };
    } else {
      throw new Error('File not found');
    }
  }
};

module.exports = { resize, save, list, remove, local };


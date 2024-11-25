const { resizeAndSave } = require('./imageService');
const AWSMock = require('aws-sdk-mock');
const sharp = require('sharp');

// Mock AWS S3
AWSMock.mock('S3', 'upload', (params, callback) => {
  callback(null, { Location: `https://s3.amazonaws.com/${params.Bucket}/${params.Key}` });
});

// Mock sharp
jest.mock('sharp');

describe('resizeAndSave', () => {
  afterAll(() => {
    AWSMock.restore('S3');
  });

  it('should resize the image and upload it to S3', async () => {
    // Mock file input
    const file = {
      buffer: Buffer.from('test-image-buffer'),
      originalname: 'test-image.jpg',
    };

    // Mock sharp implementation
    sharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('resized-image-buffer')),
    }));

    // Call the resizeAndSave function
    const result = await resizeAndSave(file);

    // Assertions
    expect(result).toHaveProperty('Location');
    expect(result.Location).toBe(`https://s3.amazonaws.com/staging-sweatworks-images/resized/${file.originalname}`);
  });

  it('should throw an error if resizing fails', async () => {
    // Mock sharp implementation to throw an error
    sharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockRejectedValue(new Error('Sharp resizing failed')),
    }));

    // Mock file input
    const file = {
      buffer: Buffer.from('test-image-buffer'),
      originalname: 'test-image.jpg',
    };

    // Call the resizeAndSave function and expect an error
    await expect(resizeAndSave(file)).rejects.toThrow('Sharp resizing failed');
  });
});

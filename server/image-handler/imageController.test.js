const { resize, save } = require('./imageController');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const { mockClient } = require('aws-sdk-client-mock');

const s3Mock = mockClient(S3Client);
jest.mock('sharp');

describe('resize and save images', () => {
  beforeEach(() => {
    s3Mock.reset();
    s3Mock.on(PutObjectCommand).resolves({ 
      Location: 'https://s3.amazonaws.com/staging-sweatworks-images/resized/test-image.jpg',
    });
  });


  it('should resize the image', async () => {
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

    const result = await resize(file);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe('resized-image-buffer');
  });

  it('should save the file into s3 bucket', async () => {
    const file = {
      buffer: Buffer.from('test-image-buffer'),
      originalname: 'test-image.jpg',
    };

    sharp.mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      toFormat: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('resized-image-buffer')),
    }));

    const resized = await resize(file);
    const saved = await save(resized);   
    expect(saved).toHaveProperty('Location');
    expect(/image\.jpg/.test(saved.Location)).toBeTruthy();
  })

  it('should throw an error if resizing fails', async () => {

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

    // Call the resize function and expect an error
    await expect(resize(file)).rejects.toThrow('Sharp resizing failed');
  });

});

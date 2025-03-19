import imageCompression, { Options } from 'browser-image-compression';
import { ImageCompressor } from 'src/domain/services/ImageService';

const imageCompOptions: Options = {
  fileType: 'image/png',
  maxSizeMB: 1,
  maxWidthOrHeight: 1000,
};

const thumbOptions: Options = {
  fileType: 'image/webp',
  maxSizeMB: 0.1,
  maxWidthOrHeight: 256,
};

export const BrowserImageCompressor: ImageCompressor = {
  async compressImage(blob) {
    const file = new File([blob], 'image.png', { type: blob.type });
    return await imageCompression(file, imageCompOptions);
  },

  async createThumbnail(blob) {
    const file = new File([blob], 'thumbnail.webp', { type: blob.type });
    return await imageCompression(file, thumbOptions);
  },
};

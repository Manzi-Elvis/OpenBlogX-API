import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'openblogx',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});
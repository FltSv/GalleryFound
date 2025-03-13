import { User } from 'firebase/auth';
import { ImageStatus } from 'src/domain/entities';
import { ImageService } from 'src/domain/services/ImageService';
import { BrowserImageCompressor } from 'src/infra/image/BrowserImageCompressor';
import { FireStorageImageRepo } from 'src/infra/firebase/StorageRepo';

const imageService = new ImageService(
  BrowserImageCompressor,
  FireStorageImageRepo,
);

export const uploadImages = async <T extends ImageStatus>(
  user: User,
  images: T[],
): Promise<T[]> => await imageService.uploadImages(user.uid, images);

import { User } from 'firebase/auth';
import { Exhibit } from 'src/domain/entities';
import { ImageService } from 'src/domain/services/ImageService';
import { BrowserImageCompressor } from 'src/infra/image/BrowserImageCompressor';
import { FireStorageImageRepo } from 'src/infra/firebase/StorageRepo';

const imageService = new ImageService(
  BrowserImageCompressor,
  FireStorageImageRepo,
);

export const uploadImages = async (
  user: User,
  images: Exhibit[],
): Promise<Exhibit[]> => await imageService.uploadImages(user.uid, images);

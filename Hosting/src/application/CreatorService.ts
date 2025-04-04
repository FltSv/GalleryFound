import { Exhibit, getDatePeriod, Product } from 'src/domain/entities';
import { ImageService } from 'src/domain/services/ImageService';
import { BrowserImageCompressor } from 'src/infra/image/BrowserImageCompressor';
import { FireStorageImageRepo } from 'src/infra/firebase/StorageRepo';
import { FirestoreCreatorRepo } from 'src/infra/firebase/CreatorRepo';

const imageService = new ImageService(
  BrowserImageCompressor,
  FireStorageImageRepo,
);

interface ExhibitData {
  title: string;
  location: string;
  galleryId: string;
  startDate: Date;
  endDate: Date;
}

export const createProduct = async (
  userId: string,
  file: File,
  order: number,
  progressCallback?: (progress: number) => void,
): Promise<Product> => {
  const productId = await FirestoreCreatorRepo.createEmptyProduct(userId);
  const result = await imageService.uploadImage(
    userId,
    file,
    productId,
    progressCallback,
  );

  const uploadedProduct: Product = {
    id: productId,
    title: file.name,
    isHighlight: false,
    detail: '',
    order,
    imageUrl: result.imageUrl,
    thumbUrl: result.thumbUrl,
    createdAt: new Date(),
    addedAt: new Date(),
  };

  await FirestoreCreatorRepo.updateProduct(userId, uploadedProduct);
  return uploadedProduct;
};

export const updateProduct = async (
  userId: string,
  product: Product,
): Promise<void> => {
  await FirestoreCreatorRepo.updateProduct(userId, product);
};

export const deleteProduct = async (userId: string, product: Product) => {
  const deleteTasks = [
    FirestoreCreatorRepo.deleteProduct(userId, product),
    imageService.deleteImage(product),
  ];
  await Promise.all(deleteTasks);
};

export const createExhibit = async (
  userId: string,
  exhibitData: ExhibitData,
  file: File,
  progressCallback?: (progress: number) => void,
): Promise<Exhibit> => {
  const exhibitId = await FirestoreCreatorRepo.createEmptyExhibit(userId);
  const result = await imageService.uploadImage(
    userId,
    file,
    exhibitId,
    progressCallback,
  );

  const uploadedExhibit: Exhibit = {
    id: exhibitId,
    title: exhibitData.title,
    imageUrl: result.imageUrl,
    thumbUrl: result.thumbUrl,
    location: exhibitData.location,
    galleryId: exhibitData.galleryId,
    startDate: exhibitData.startDate,
    endDate: exhibitData.endDate,
    getDatePeriod: function () {
      return getDatePeriod(this.startDate, this.endDate);
    },
  };

  await FirestoreCreatorRepo.updateExhibit(userId, uploadedExhibit);
  return uploadedExhibit;
};

export const updateExhibit = async (
  userId: string,
  exhibit: Exhibit,
  file?: File,
  progressCallback?: (progress: number) => void,
): Promise<Exhibit> => {
  if (file === undefined) {
    // 画像の更新がない場合
    await FirestoreCreatorRepo.updateExhibit(userId, exhibit);
    return exhibit;
  }

  // 画像の更新がある場合
  const result = await imageService.uploadImage(
    userId,
    file,
    exhibit.id,
    progressCallback,
  );
  const imageUpdatedExhibit = {
    ...exhibit,
    imageUrl: result.imageUrl,
    thumbUrl: result.thumbUrl,
  };
  await FirestoreCreatorRepo.updateExhibit(userId, imageUpdatedExhibit);
  return imageUpdatedExhibit;
};

export const deleteExhibit = async (userId: string, exhibit: Exhibit) => {
  const deleteTasks = [
    FirestoreCreatorRepo.deleteExhibit(userId, exhibit),
    imageService.deleteImage(exhibit),
  ];
  await Promise.all(deleteTasks);
};

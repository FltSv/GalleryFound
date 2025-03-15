import { Product } from 'src/domain/entities';
import { ImageService } from 'src/domain/services/ImageService';
import { BrowserImageCompressor } from 'src/infra/image/BrowserImageCompressor';
import { FireStorageImageRepo } from 'src/infra/firebase/StorageRepo';
import { FirestoreCreatorRepo } from 'src/infra/firebase/CreatorRepo';

const imageService = new ImageService(
  BrowserImageCompressor,
  FireStorageImageRepo,
);

export const createProduct = async (
  userId: string,
  file: File,
  order: number,
): Promise<Product> => {
  const productId = await FirestoreCreatorRepo.createEmptyProduct(userId);
  const result = await imageService.uploadImage(userId, file, productId);

  const uploadedProduct: Product = {
    id: productId,
    title: file.name,
    isHighlight: false,
    detail: '',
    order,
    tmpImageData: '',
    srcImage: parseSrcImage(result.imageUrl),
    imageUrl: result.imageUrl,
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

const parseSrcImage = (imageUrl: string) =>
  imageUrl.match(/.*%2F(.*)$/)?.[1] ?? '';

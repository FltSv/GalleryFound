import { FirestoreDataConverter } from 'firebase/firestore';
import { Product } from 'src/domain/entities';
import { Product as FirebaseProduct } from 'src/infra/firebase/firebaseConfig';
import { getCreatorStorageUrl } from 'src/infra/firebase/CreatorRepo';
import { storageCreatorsBaseUrl } from 'src/infra/firebase/StorageRepo';

const fromFirestoreImageUrl = (
  image: string,
  imageUrl?: string,
  userId?: string,
): string => {
  if (userId === undefined) {
    throw new Error('userId is undefined');
  }

  if (imageUrl === undefined) {
    return getCreatorStorageUrl(userId) + image;
  }

  return storageCreatorsBaseUrl + imageUrl;
};

const toFirestoreImageUrl = (imageUrl: string): string =>
  imageUrl.match(/.*creators%2F(.*)$/)?.[1] ?? imageUrl;

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot, options?, isHighlight: boolean = false) {
    const data = snapshot.data(options) as FirebaseProduct;
    const userId = snapshot.ref.parent.parent?.id;

    return {
      id: data.id,
      title: data.title ?? '',
      isHighlight: isHighlight,
      detail: data.detail ?? '',
      order: data.order,
      srcImage: data.image,
      imageUrl: fromFirestoreImageUrl(data.image, data.imagePath, userId),
      tmpImageData: '',
    } satisfies Product;
  },

  toFirestore(product: Product) {
    return {
      id: product.id,
      title: product.title,
      detail: product.detail,
      image: product.srcImage,
      imagePath: toFirestoreImageUrl(product.imageUrl),
      order: product.order,
    } satisfies FirebaseProduct;
  },
};

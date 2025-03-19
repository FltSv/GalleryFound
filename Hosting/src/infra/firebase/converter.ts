import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';
import { Exhibit, Product, getDatePeriod } from 'src/domain/entities';
import {
  Product as FirebaseProduct,
  Exhibit as FirebaseExhibit,
} from 'src/infra/firebase/firebaseConfig';
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

const fromFirestoreThumbUrl = (thumbUrl?: string): string => {
  if (thumbUrl === undefined || thumbUrl === '') {
    return '';
  }

  return storageCreatorsBaseUrl + thumbUrl;
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
      thumbUrl: fromFirestoreThumbUrl(data.thumbPath),
      tmpImageData: '',
      createdAt: data.createdAt?.toDate(),
      addedAt: data.addedAt?.toDate(),
    } satisfies Product;
  },

  toFirestore(product: Product) {
    return {
      id: product.id,
      title: product.title,
      detail: product.detail,
      order: product.order,
      image: product.srcImage,
      imagePath: toFirestoreImageUrl(product.imageUrl),
      thumbPath: toFirestoreImageUrl(product.thumbUrl),
      createdAt: product.createdAt
        ? Timestamp.fromDate(product.createdAt)
        : undefined,
      addedAt: product.addedAt
        ? Timestamp.fromDate(product.addedAt)
        : undefined,
    } satisfies FirebaseProduct;
  },
};
export const exhibitConverter: FirestoreDataConverter<Exhibit> = {
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseExhibit;
    const userId = snapshot.ref.parent.parent?.id;
    const epochDate = new Date(0);

    return {
      id: data.id,
      title: data.title,
      location: data.location,
      galleryId: data.galleryId,
      startDate: data.startDate?.toDate() ?? epochDate,
      endDate: data.endDate?.toDate() ?? epochDate,
      srcImage: data.image,
      imageUrl: fromFirestoreImageUrl(data.image, data.imagePath, userId),
      thumbUrl: fromFirestoreThumbUrl(data.thumbPath),
      tmpImageData: '',
      getDatePeriod: function () {
        return getDatePeriod(this.startDate, this.endDate);
      },
    } satisfies Exhibit;
  },

  toFirestore(exhibit: Exhibit) {
    return {
      id: exhibit.id,
      title: exhibit.title,
      location: exhibit.location,
      galleryId: exhibit.galleryId,
      startDate: Timestamp.fromDate(exhibit.startDate),
      endDate: Timestamp.fromDate(exhibit.endDate),
      image: exhibit.srcImage,
      imagePath: toFirestoreImageUrl(exhibit.imageUrl),
      thumbPath: toFirestoreImageUrl(exhibit.thumbUrl),
    } satisfies FirebaseExhibit;
  },
};

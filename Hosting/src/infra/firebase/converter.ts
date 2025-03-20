import {
  FirestoreDataConverter,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';
import {
  Creator,
  Exhibit,
  Gallery,
  Product,
  getDatePeriod,
} from 'src/domain/entities';
import {
  Creator as FirebaseCreator,
  Product as FirebaseProduct,
  Exhibit as FirebaseExhibit,
  Gallery as FirebaseGallery,
} from 'src/infra/firebase/firebaseConfig';
import { getCreatorStorageUrl } from 'src/infra/firebase/CreatorRepo';
import { storageCreatorsBaseUrl } from 'src/infra/firebase/StorageRepo';

const EPOCH_DATE = new Date(0);

const fromFirestoreImageUrl = (
  image: string,
  imagePath?: string,
  userId?: string,
): string => {
  if (userId === undefined) {
    throw new Error('userId is undefined');
  }

  if (imagePath === undefined) {
    return getCreatorStorageUrl(userId) + image;
  }

  return storageCreatorsBaseUrl + imagePath;
};

const fromFirestoreThumbUrl = (thumbPath?: string): string => {
  if (thumbPath === undefined || thumbPath === '') {
    return '';
  }

  return storageCreatorsBaseUrl + thumbPath;
};

const toFirestoreImageUrl = (imageUrl: string): string =>
  imageUrl.match(/.*creators%2F(.*)$/)?.[1] ?? imageUrl;

export const creatorConverter: FirestoreDataConverter<Creator> = {
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseCreator;

    // todo: v0.6.1で削除
    const products_old =
      data.products?.map(
        (x, i) =>
          ({
            id: x.id,
            title: x.title ?? '',
            isHighlight: x.id === data.highlightProductId,
            detail: x.detail ?? '',
            order: i,
            createdAt: x.createdAt?.toDate(),
            addedAt: x.addedAt?.toDate(),
            srcImage: x.image,
            imageUrl: fromFirestoreImageUrl(x.image, undefined, snapshot.id),
            thumbUrl: '',
            tmpImageData: '',
          }) satisfies Product,
      ) ?? [];

    // todo: v0.6.1で削除
    const exhibits_old =
      data.exhibits?.map(
        x =>
          ({
            id: x.id,
            title: x.title,
            location: x.location,
            startDate: x.startDate?.toDate() ?? EPOCH_DATE,
            endDate: x.endDate?.toDate() ?? EPOCH_DATE,
            galleryId: x.galleryId,
            srcImage: x.image,
            imageUrl: fromFirestoreImageUrl(x.image, undefined, snapshot.id),
            thumbUrl: '',
            tmpImageData: '',
            getDatePeriod: function () {
              return getDatePeriod(this.startDate, this.endDate);
            },
          }) satisfies Exhibit,
      ) ?? [];

    return {
      name: data.name ?? '',
      genre: data.genre ?? '',
      profile: data.profile ?? '',
      profileHashtags: data.profileHashtags ?? [],
      links: data.links ?? [],
      highlightProductId: data.highlightProductId ?? null,
      highlightThumbUrl:
        data.highlightProductThumbPath === undefined
          ? null
          : storageCreatorsBaseUrl + data.highlightProductThumbPath,
      products: products_old,
      exhibits: exhibits_old,
    } satisfies Creator;
  },

  toFirestore(creator: Creator) {
    const highlightProduct = creator.products.find(x => x.isHighlight);

    const highlightProductThumbUrl =
      highlightProduct?.thumbUrl ?? creator.products.at(0)?.thumbUrl;

    const highlightProductThumbPath =
      highlightProductThumbUrl !== undefined
        ? toFirestoreImageUrl(highlightProductThumbUrl)
        : undefined;

    return {
      name: creator.name,
      genre: creator.genre,
      profile: creator.profile,
      profileHashtags: creator.profileHashtags,
      links: creator.links,
      highlightProductId: highlightProduct?.id,
      highlightProductThumbPath,
      // todo: v0.6.1で削除
      products: creator.products.map(
        x =>
          ({
            id: x.id,
            title: x.title,
            detail: x.detail,
            image: x.srcImage,
            order: x.order,
          }) satisfies FirebaseProduct,
      ),
      // todo: v0.6.1で削除
      exhibits: creator.exhibits.map(
        x =>
          ({
            id: x.id,
            title: x.title,
            location: x.location,
            galleryId: x.galleryId,
            startDate: Timestamp.fromDate(x.startDate),
            endDate: Timestamp.fromDate(x.endDate),
            image: x.srcImage,
          }) satisfies FirebaseExhibit,
      ),
    } satisfies FirebaseCreator;
  },
};

export const productConverter: FirestoreDataConverter<Product> = {
  fromFirestore(snapshot, options?, highlightProductId?: string) {
    const data = snapshot.data(options) as FirebaseProduct;
    const userId = snapshot.ref.parent.parent?.id;

    const isHighlight =
      highlightProductId !== undefined && highlightProductId !== ''
        ? data.id === highlightProductId
        : false;

    return {
      id: data.id,
      title: data.title ?? '',
      isHighlight,
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

    return {
      id: data.id,
      title: data.title,
      location: data.location,
      galleryId: data.galleryId,
      startDate: data.startDate?.toDate() ?? EPOCH_DATE,
      endDate: data.endDate?.toDate() ?? EPOCH_DATE,
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

export const galleryConverter: FirestoreDataConverter<Gallery> = {
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseGallery;
    const { latitude, longitude } = data.latLng.toJSON();

    return {
      ...data,
      id: snapshot.id,
      latLng: { lat: latitude, lng: longitude },
    } satisfies Gallery;
  },

  toFirestore(gallery: Gallery) {
    const { lat, lng } = gallery.latLng;
    return {
      ...gallery,
      latLng: new GeoPoint(lat, lng),
    } satisfies FirebaseGallery;
  },
};

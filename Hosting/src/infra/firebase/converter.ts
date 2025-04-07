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
import { storageCreatorsBaseUrl } from 'src/infra/firebase/StorageRepo';

const EPOCH_DATE = new Date(0);

const fromFirestoreImageUrl = (imagePath: string): string =>
  storageCreatorsBaseUrl + imagePath;

const toFirestoreImageUrl = (imageUrl: string): string =>
  imageUrl.match(/.*creators%2F(.*)$/)?.[1] ?? imageUrl;

export const creatorConverter: FirestoreDataConverter<Creator> = {
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseCreator;

    return {
      id: snapshot.id,
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
      products: [],
      exhibits: [],
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
      updateAt: Timestamp.fromDate(new Date()),
    } satisfies FirebaseCreator;
  },
};

export const getProductConverter = (
  highlightProductId: string | null,
): FirestoreDataConverter<Product> => ({
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseProduct;

    return {
      id: data.id,
      title: data.title ?? '',
      isHighlight: data.id === highlightProductId,
      detail: data.detail ?? '',
      order: data.order,
      imageUrl: fromFirestoreImageUrl(data.imagePath),
      thumbUrl: fromFirestoreImageUrl(data.thumbPath),
      createdAt: data.createdAt.toDate(),
      addedAt: data.addedAt.toDate(),
    } satisfies Product;
  },

  toFirestore(product: Product) {
    return {
      id: product.id,
      title: product.title,
      detail: product.detail,
      order: product.order,
      imagePath: toFirestoreImageUrl(product.imageUrl),
      thumbPath: toFirestoreImageUrl(product.thumbUrl),
      createdAt: Timestamp.fromDate(product.createdAt),
      addedAt: Timestamp.fromDate(product.addedAt),
    } satisfies FirebaseProduct;
  },
});

export const exhibitConverter: FirestoreDataConverter<Exhibit> = {
  fromFirestore(snapshot, options?) {
    const data = snapshot.data(options) as FirebaseExhibit;

    return {
      id: data.id,
      title: data.title,
      location: data.location,
      galleryId: data.galleryId,
      startDate: data.startDate?.toDate() ?? EPOCH_DATE,
      endDate: data.endDate?.toDate() ?? EPOCH_DATE,
      imageUrl: fromFirestoreImageUrl(data.imagePath),
      thumbUrl: fromFirestoreImageUrl(data.thumbPath),
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

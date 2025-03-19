import {
  collection,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { Gallery } from 'src/domain/entities';
import { LatLng } from 'src/domain/services/GeocodingService';
import {
  collectionNames,
  db,
  fbGalleryConverter,
} from 'src/infra/firebase/firebaseConfig';

/**
 * ギャラリーリポジトリの型定義
 */
export interface GalleryRepo {
  /** ギャラリー情報の一覧を取得 */
  getGalleries: () => Promise<Gallery[]>;

  /** ギャラリー情報を追加 */
  addGallery: (data: Gallery, latLng: LatLng) => Promise<void>;

  /** galleryIdの配列に対応するギャラリー情報を取得 */
  getGalleriesByIds: (galleryIds: string[]) => Promise<Gallery[]>;
}

/** ギャラリー情報の一覧を取得 */
const getGalleries = async () => {
  const colRef = collection(db, collectionNames.galleries);
  const querySnap = await getDocs(colRef.withConverter(fbGalleryConverter));

  return querySnap.docs.map(doc => {
    const data = doc.data();
    const { latitude, longitude } = data.latLng.toJSON();
    return { ...data, id: doc.id, latLng: { lat: latitude, lng: longitude } };
  });
};

/** ギャラリー情報を追加 */
const addGallery = async (data: Gallery, { lat, lng }: LatLng) => {
  const { id, ...firebaseData } = { ...data, latLng: new GeoPoint(lat, lng) };
  void id;

  // Firestoreの自動採番を使用
  const colRef = collection(db, collectionNames.galleries);
  const docRef = doc(colRef);
  await setDoc(docRef.withConverter(fbGalleryConverter), firebaseData);
};

/**
 * galleryIdの配列に対応するギャラリー情報を取得
 */
const getGalleriesByIds = async (galleryIds: string[]): Promise<Gallery[]> => {
  if (galleryIds.length === 0) {
    return [];
  }

  const getGalleryDocSnapTasks = galleryIds.map(id => {
    const docRef = doc(db, collectionNames.galleries, id);
    const galleryDocRef = docRef.withConverter(fbGalleryConverter);
    return getDoc(galleryDocRef);
  });

  const galleryDocSnaps = await Promise.all(getGalleryDocSnapTasks);
  const galleries = galleryDocSnaps
    .filter(docSnap => docSnap.exists())
    .map(docSnap => {
      const data = docSnap.data();
      const { latitude, longitude } = data.latLng.toJSON();
      return {
        ...data,
        id: docSnap.id,
        latLng: { lat: latitude, lng: longitude },
      };
    });

  return galleries;
};

// Firebase実装のリポジトリをエクスポート
export const galleryRepo: GalleryRepo = {
  getGalleries,
  addGallery,
  getGalleriesByIds,
};

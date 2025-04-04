import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Gallery } from 'src/domain/entities';
import { LatLng } from 'src/domain/services/GeocodingService';
import { collectionNames, db } from 'src/infra/firebase/firebaseConfig';
import { galleryConverter } from 'src/infra/firebase/converter';

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
  const querySnap = await getDocs(colRef.withConverter(galleryConverter));

  return querySnap.docs.map(doc => doc.data());
};

/** ギャラリー情報を追加 */
const addGallery = async (data: Gallery, latLng: LatLng) => {
  const gallery = { ...data, latLng } satisfies Gallery;

  // Firestoreの自動採番を使用
  const colRef = collection(db, collectionNames.galleries);
  const docRef = doc(colRef).withConverter(galleryConverter);
  await setDoc(docRef, gallery);
};

/**
 * galleryIdの配列に対応するギャラリー情報を取得
 */
const getGalleriesByIds = async (galleryIds: string[]): Promise<Gallery[]> => {
  if (galleryIds.length === 0) {
    return [];
  }

  const getGalleryDocSnapTasks = galleryIds.map(id => {
    const docRef = doc(db, collectionNames.galleries, id).withConverter(
      galleryConverter,
    );
    return getDoc(docRef);
  });

  const galleryDocSnaps = await Promise.all(getGalleryDocSnapTasks);
  const galleries = galleryDocSnaps
    .filter(docSnap => docSnap.exists())
    .map(docSnap => docSnap.data());

  return galleries;
};

// Firebase実装のリポジトリをエクスポート
export const galleryRepo: GalleryRepo = {
  getGalleries,
  addGallery,
  getGalleriesByIds,
};

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { Gallery } from 'src/domain/entities';
import { collectionNames, db } from 'src/infra/firebase/firebaseConfig';
import { galleryConverter } from 'src/infra/firebase/converter';

/**
 * ギャラリーリポジトリの型定義
 */
export interface GalleryRepo {
  /** galleryIdに対応するギャラリー情報を取得 */
  getGallery: (galleryId: string) => Promise<Gallery | undefined>;

  /** placeIdに対応するギャラリー情報を取得 */
  getGalleryByPlaceId: (placeId: string) => Promise<Gallery | undefined>;

  /** ギャラリー情報の一覧を取得 */
  getGalleries: () => Promise<Gallery[]>;

  /** ギャラリー情報を追加 */
  addGallery: (data: Omit<Gallery, 'id'>) => Promise<Gallery>;

  /** ギャラリー情報の編集 */
  updateGallery: (data: Gallery) => Promise<void>;

  /** galleryIdの配列に対応するギャラリー情報を取得 */
  getGalleriesByIds: (galleryIds: string[]) => Promise<Gallery[]>;
}

/** galleryIdに対応するギャラリー情報を取得 */
const getGallery = async (galleryId: string) => {
  const colRef = collection(db, collectionNames.galleries);
  const docRef = doc(colRef, galleryId).withConverter(galleryConverter);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

/** placeIdに対応するギャラリー情報を取得 */
const getGalleryByPlaceId = async (placeId: string) => {
  const colRef = collection(db, collectionNames.galleries).withConverter(
    galleryConverter,
  );
  const queryRef = query(colRef, where('placeId', '==', placeId));
  const querySnap = await getDocs(queryRef);

  if (querySnap.empty) {
    return undefined;
  }

  return querySnap.docs[0].data();
};

/** ギャラリー情報の一覧を取得 */
const getGalleries = async () => {
  const colRef = collection(db, collectionNames.galleries);
  const querySnap = await getDocs(colRef.withConverter(galleryConverter));

  return querySnap.docs.map(doc => doc.data());
};

/** ギャラリー情報を追加 */
const addGallery = async (data: Omit<Gallery, 'id'>) => {
  // Firestoreの自動採番を使用
  const colRef = collection(db, collectionNames.galleries);
  const docRef = doc(colRef).withConverter(galleryConverter);
  const gallery = { ...data, id: docRef.id } satisfies Gallery;
  await setDoc(docRef, gallery);
  return gallery;
};

/** ギャラリー情報の編集 */
const updateGallery = async (data: Gallery) => {
  const docRef = doc(db, collectionNames.galleries, data.id).withConverter(
    galleryConverter,
  );
  await setDoc(docRef, data);
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
  getGallery,
  getGalleryByPlaceId,
  getGalleries,
  addGallery,
  updateGallery,
  getGalleriesByIds,
};

import {
  collection,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getLatLngFromAddress } from 'src/Data';
import { Gallery } from 'src/domains/entities';
import {
  collectionNames,
  db,
  fbGalleryConverter,
} from 'src/infra/firebase/firebaseConfig';
import { getUlid } from 'src/ULID';

/** ギャラリー情報の一覧を取得 */
export const getGalleries = async () => {
  const colRef = collection(db, collectionNames.galleries);
  const querySnap = await getDocs(colRef.withConverter(fbGalleryConverter));

  return querySnap.docs.map(doc => {
    const data = doc.data();
    const { latitude, longitude } = data.latLng.toJSON();
    return { ...data, id: doc.id, latLng: { lat: latitude, lng: longitude } };
  });
};

/** ギャラリー情報を追加 */
export const addGallery = async (data: Gallery) => {
  const { lat, lng } = await getLatLngFromAddress(data.location);
  const { id, ...firebaseData } = { ...data, latLng: new GeoPoint(lat, lng) };
  void id;

  const docRef = doc(db, collectionNames.galleries, getUlid());
  await setDoc(docRef.withConverter(fbGalleryConverter), firebaseData);
};

/**
 * galleryIdの配列に対応するギャラリー情報を取得
 */
export const getGalleriesByIds = async (
  galleryIds: string[],
): Promise<Gallery[]> => {
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

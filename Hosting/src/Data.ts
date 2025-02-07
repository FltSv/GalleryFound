import { collection, doc, GeoPoint, getDocs, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression, { Options } from 'browser-image-compression';
import {
  db,
  fbCreatorConverter,
  fbGalleryConverter,
  getConfig,
} from 'src/infra/firebase/firebaseConfig';
import { getUlid } from 'src/ULID';
import { Exhibit, Gallery, ImageStatus } from 'src/domains/entities';
import {
  collectionNames,
  getCreatorStorageUrl,
} from 'src/infra/firebase/CreatorRepo';

const imageCompOptions: Options = {
  fileType: 'image/png',
  maxSizeMB: 1,
  maxWidthOrHeight: 1000,
};

const thumbOptions: Options = {
  fileType: 'image/webp',
  maxSizeMB: 0.1,
  maxWidthOrHeight: 256,
};

/**
 * tmpImageDataの画像をアップロード、URLを格納
 */
export const uploadImageData = async <T extends ImageStatus>(
  user: User,
  images: T[],
): Promise<T[]> => {
  const uploadImage = async (image: T) => {
    // イメージの更新が無ければスキップ
    if (image.tmpImageData === '') {
      return image;
    }

    // blobURL→blobオブジェクトへ変換
    const response = await fetch(image.tmpImageData);
    const blob = await response.blob();

    // 圧縮
    const file = new File([blob], 'tmpFile', { type: blob.type });
    const compressedFile = await imageCompression(file, imageCompOptions);

    // Storageへアップロード
    const storage = getStorage();
    const fileId = getUlid();

    const path = `${collectionNames.creators}/${user.uid}/${fileId}.png`;
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, compressedFile);

    // サムネイルの生成、アップロード
    const thumbFile = await imageCompression(compressedFile, thumbOptions);
    const thumbPath = `${collectionNames.creators}/${user.uid}/thumbs/${fileId}.webp`;
    const thumbRef = ref(storage, thumbPath);
    await uploadBytes(thumbRef, thumbFile);

    const url = await getDownloadURL(result.ref);
    const name = result.metadata.name;
    const srcImage = url.match(`${name}.*`)?.[0] ?? '';
    const newImage: T = { ...image, srcImage: srcImage };
    return newImage;
  };

  const tasks = images.map(uploadImage);
  return await Promise.all(tasks);
};

/** すべての展示情報の取得 */
export const getAllExhibits = async () => {
  const creatorsSnap = await getDocs(
    collection(db, collectionNames.creators).withConverter(fbCreatorConverter),
  );

  const config = await getConfig();
  const ignoreIds = config.debugUserIds;
  const isDebug = process.env.NODE_ENV === 'development';

  const exhibitsPromises = creatorsSnap.docs
    .filter(d => isDebug || !ignoreIds.includes(d.id))
    .map(creatorDocSnap => {
      const data = creatorDocSnap.data();
      const today = new Date();
      const exhibits: Exhibit[] =
        data.exhibits?.map(x => ({
          ...x,
          startDate: x.startDate?.toDate() ?? today,
          endDate: x.endDate?.toDate() ?? today,
          galleryId: x.galleryId,
          srcImage: x.image,
          imageUrl: getCreatorStorageUrl(creatorDocSnap.id) + x.image,
          tmpImageData: '',
        })) ?? [];

      return exhibits;
    });

  const resolvedExhibits = await Promise.all(exhibitsPromises);
  return resolvedExhibits.flat();
};

export interface GalleryExhibits {
  gallery: Gallery;
  exhibits: Exhibit[];
}

/** ギャラリー情報と関連する展示の配列を取得 */
export const getGalleryExhibits = async () => {
  const galleries = await getGalleries();
  const exhibits = await getAllExhibits();

  const groupedExhibits = Map.groupBy(exhibits, x => x.location);

  const array = Array.from(groupedExhibits.entries())
    .map(([key, value]) => {
      const gallery = galleries.find(x => x.name === key);
      if (gallery === undefined) return null;
      return {
        gallery: gallery,
        exhibits: value,
      };
    })
    .filter((x): x is GalleryExhibits => x !== null);

  return array;
};

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

/** 住所から緯度経度を取得する */
const getLatLngFromAddress = async (address: string) => {
  const geocoder = new google.maps.Geocoder();
  const geocodingTask = new Promise<google.maps.GeocoderResult[]>(
    (resolve, reject) =>
      void geocoder.geocode({ address: address }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          reject(new Error(status));
        }

        if (results !== null) {
          resolve(results);
        }

        reject(new Error('result is null'));
      }),
  );

  const results = await geocodingTask;

  console.debug(
    `get geocode: "${address}": `,
    results[0].geometry.location.toJSON(),
  );

  return results[0].geometry.location.toJSON();
};

/** 日付の期間の表示値を返す */
export const getDatePeriodString = (start: Date, end: Date) => {
  const startString = start.toLocaleDateString();
  const endString = end.toLocaleDateString();
  return `${startString} ～ ${endString}`;
};

import {
  collection,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';
import imageCompression, { Options } from 'browser-image-compression';

import {
  db,
  fbCreatorConverter,
  fbGalleryConverter,
  getConfig,
} from './firebase';
import { getUlid } from 'src/ULID';

const collectionNames = {
  creators: 'creators',
  galleries: 'galleries',
} as const;

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

const getCreatorStorageUrl = (userId: string) =>
  `https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F${userId}%2F`;

export const getCreatorData = async (user: User) => {
  const userId = user.uid;
  const creatorUrl = getCreatorStorageUrl(userId);

  // Firestoreからユーザーデータを取得
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
  );
  const docSnap = await getDoc(docRef);

  // 作家情報が存在しているか
  if (!docSnap.exists()) {
    // 存在しない場合、情報は空のままで登録を促す
    const empty: Creator = {
      name: '',
      genre: '',
      profile: '',
      links: [],
      products: [],
      exhibits: [],
    };

    return empty;
  }

  // ドキュメントが存在する場合、詳細を取得
  const data = docSnap.data();
  console.debug('docSnap.data:', data);

  const name = data.name ?? '';
  const genre = data.genre ?? '';
  const profile = data.profile ?? '';
  const links = data.links ?? [];
  const highlightProductId = data.highlightProductId ?? '';

  // 発表作品
  const fbProducts = data.products ?? [];
  const products = fbProducts.map(x => ({
    id: x.id,
    title: x.title ?? '',
    isHighlight: x.id === highlightProductId,
    detail: x.detail ?? '',
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    tmpImageData: '',
  }));

  // 展示登録
  const fbExhibits = data.exhibits ?? [];
  const today = new Date();
  const exhibits = fbExhibits.map(x => ({
    id: x.id,
    title: x.title,
    location: x.location,
    startDate: x.startDate?.toDate() ?? today,
    endDate: x.endDate?.toDate() ?? today,
    galleryId: x.galleryId,
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    tmpImageData: '',
  }));

  const creator: Creator = {
    name: name,
    genre: genre,
    profile: profile,
    links: links,
    products: products,
    exhibits: exhibits,
  };

  console.debug('creator:', creator);
  return creator;
};

/**
 *  値の確定、DBへデータを送信する
 */
export const setCreatorData = async (user: User, data: Creator) => {
  const userId = user.uid;

  // 画像のアップロード
  const products = await uploadImageData(user, data.products);
  const exhibits = await uploadImageData(user, data.exhibits);

  // DB更新
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
  );
  await setDoc(docRef, {
    name: data.name,
    genre: data.genre,
    profile: data.profile,
    links: data.links,
    highlightProductId: data.products.find(x => x.isHighlight)?.id,
    products: products.map(x => ({
      id: x.id,
      title: x.title,
      detail: x.detail,
      image: x.srcImage,
    })),
    exhibits: exhibits.map(x => ({
      id: x.id,
      title: x.title,
      location: x.location,
      galleryId: x.galleryId,
      startDate: Timestamp.fromDate(x.startDate),
      endDate: Timestamp.fromDate(x.endDate),
      image: x.srcImage,
    })),
  });

  // 使用されていない画像の削除
  // 使用中の画像
  const usingImages = [...products, ...exhibits].map(
    (x: ImageStatus) => x.srcImage.split('?')[0],
  );

  // Storage内の画像
  const allImagesRef = ref(
    getStorage(),
    `${collectionNames.creators}/${userId}`,
  );
  const allImages = await listAll(allImagesRef).then(res =>
    res.items.map(item => item.name),
  );

  // 未使用画像の抽出、削除
  const unusedImages = allImages.filter(image => !usingImages.includes(image));
  const deleteTasks = unusedImages.map(async unusedImage => {
    const unusedRef = ref(
      getStorage(),
      `${collectionNames.creators}/${userId}/${unusedImage}`,
    );
    await deleteObject(unusedRef);

    const unusedThumbRef = ref(
      getStorage(),
      `${collectionNames.creators}/${userId}/thumbs/${unusedImage}`,
    );
    await deleteObject(unusedThumbRef);
  });
  await Promise.all(deleteTasks);

  // 処理完了
  console.debug('complete setCreatorData');
};

/**
 * tmpImageDataの画像をアップロード、URLを格納
 */
const uploadImageData = async <T extends ImageStatus>(
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

/** 作家 */
export interface Creator {
  /** 表示名 */
  name: string;

  /** ジャンル */
  genre: string;

  /** プロフィール */
  profile: string;

  /** SNSリンク */
  links: string[];

  /** 発表作品一覧 */
  products: Product[];

  /** 展示一覧 */
  exhibits: Exhibit[];
}

/** 発表作品 */
export interface Product extends ImageStatus {
  id: string;

  /** 作品名 */
  title: string;

  /** 代表作品か */
  isHighlight: boolean;

  /** 作品説明、他 */
  detail: string;
}

/** 展示 */
export interface Exhibit extends ImageStatus {
  id: string;

  /** 展示名 */
  title: string;

  /** 展示場所 */
  location: string;
  galleryId: string;

  /** 展示期間 */
  startDate: Date;
  endDate: Date;
}

interface ImageStatus {
  /* DBのファイル名＋トークン */
  srcImage: string;

  /** イメージ(Upload前) */
  tmpImageData: string;

  /** イメージ(Upload後) */
  imageUrl: string;
}

/** ギャラリー情報 */
export interface Gallery {
  id: string;
  name: string;
  location: string;
  latLng: google.maps.LatLngLiteral;
}

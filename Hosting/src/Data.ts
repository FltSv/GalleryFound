import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
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

import { db, fbCreatorConverter } from './firebase';
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

function getCreatorStorageUrl(userId: string) {
  return `https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F${userId}%2F`;
}

export async function getCreatorData(user: User) {
  const userId = user.uid;
  const creatorUrl = getCreatorStorageUrl(userId);
  const creator: Creator = {
    name: '',
    products: [],
    exhibits: [],
  };

  // Firestoreからユーザーデータを取得
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
  );
  const docSnap = await getDoc(docRef);

  // 作家情報が存在しているか
  if (!docSnap.exists()) {
    // 存在しない場合、情報は空のままで登録を促す
    return creator;
  }

  // ドキュメントが存在する場合、詳細を取得
  const data = docSnap.data();
  console.debug('docSnap.data:', data);

  creator.name = data.name ?? '';

  // 発表作品
  const fbProducts = data.products ?? [];
  creator.products = fbProducts.map(x => ({
    id: x.id,
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    tmpImageData: '',
  }));

  // 展示登録
  const fbExhibits = data.exhibits ?? [];
  creator.exhibits = fbExhibits.map(x => ({
    id: x.id,
    title: x.title,
    location: x.location,
    date: x.date,
    srcImage: x.image,
    imageUrl: creatorUrl + x.image,
    tmpImageData: '',
  }));

  console.debug('creator:', creator);
  return creator;
}

/**
 *  値の確定、DBへデータを送信する
 */
export async function setCreatorData(user: User, data: Creator) {
  const userId = user.uid;

  // 画像のアップロード
  await uploadImageData(user, data.products);
  await uploadImageData(user, data.exhibits);

  // DB更新
  const docRef = doc(db, collectionNames.creators, userId).withConverter(
    fbCreatorConverter,
  );
  await setDoc(docRef, {
    name: data.name,
    products: data.products.map(x => ({ id: x.id, image: x.srcImage })),
    exhibits: data.exhibits.map(x => ({
      id: x.id,
      title: x.title,
      location: x.location,
      date: x.date,
      image: x.srcImage,
    })),
  });

  // 使用されていない画像の削除
  // 使用中の画像
  const usingImages = [...data.products, ...data.exhibits].map(
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
  });
  await Promise.all(deleteTasks);

  // 処理完了
  console.debug('complete setCreatorData');
}

/**
 * tmpImageDataの画像をアップロード、URLを格納
 */
async function uploadImageData(user: User, images: ImageStatus[]) {
  const uploadImage = async (image: ImageStatus) => {
    // イメージの更新が無ければスキップ
    if (image.tmpImageData === '') {
      return;
    }

    // blobURL→blobオブジェクトへ変換
    const response = await fetch(image.tmpImageData);
    const blob = await response.blob();

    // 圧縮
    const file = new File([blob], 'tmpFile', { type: blob.type });
    const compressedFile = await imageCompression(file, imageCompOptions);

    // Storageへアップロード
    const storage = getStorage();
    const path = `${collectionNames.creators}/${user.uid}/${getUlid()}.png`;
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, compressedFile);

    const url = await getDownloadURL(result.ref);
    const name = result.metadata.name;
    image.srcImage = url.match(`${name}.*`)?.[0] ?? '';
  };

  const tasks = images.map(exhibit => uploadImage(exhibit));
  await Promise.all(tasks);
}

/** すべての展示情報の取得 */
export async function getAllExhibits() {
  const creatorsSnap = await getDocs(
    collection(db, collectionNames.creators).withConverter(fbCreatorConverter),
  );
  const exhibitsPromises = creatorsSnap.docs.map(creatorDocSnap => {
    const data = creatorDocSnap.data();
    const exhibits: Exhibit[] =
      data.exhibits?.map(x => ({
        ...x,
        srcImage: x.image,
        imageUrl: getCreatorStorageUrl(creatorDocSnap.id) + x.image,
        tmpImageData: '',
      })) ?? [];

    return exhibits;
  });

  const resolvedExhibits = await Promise.all(exhibitsPromises);
  return resolvedExhibits.flat();
}

export interface GalleryExhibits {
  gallery: Gallery;
  exhibits: Exhibit[];
}

/** ギャラリー情報と関連する展示の配列を取得 */
export async function getGalleryExhibits() {
  const galleries = await getGalleries();
  const exhibits = await getAllExhibits();

  const array: GalleryExhibits[] = [];

  Map.groupBy(exhibits, x => x.location).forEach((value, key) => {
    const gallery = galleries.find(x => x.name === key);
    if (gallery === undefined) return;

    array.push({
      gallery: gallery,
      exhibits: value,
    });
  });

  return array;
}

/** ギャラリー情報の一覧を取得 */
export async function getGalleries() {
  const querySnap = await getDocs(collection(db, collectionNames.galleries));
  return querySnap.docs.map(doc => {
    const data = doc.data();
    return { ...data, id: doc.id } as Gallery;
  });
}

/** ギャラリー情報を追加 */
export async function addGallery(data: Gallery) {
  const latLng = await getLatLngFromAddress(data.location);
  const { id, ...firebaseData } = { ...data, latLng: latLng };
  void id;

  await setDoc(doc(db, collectionNames.galleries, getUlid()), firebaseData);
}

/** 住所から緯度経度を取得する */
async function getLatLngFromAddress(address: string) {
  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode(
    { address: address },
    (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        console.error('Geocoding API returned status:', status);
        throw new Error(status);
      }

      if (results === null) {
        throw new Error('result is null');
      }

      return;
    },
  );

  console.debug(
    `get geocode: "${address}": `,
    response.results[0].geometry.location.toJSON(),
  );

  return response.results[0].geometry.location.toJSON();
}

/** 作家 */
export interface Creator {
  /** 表示名 */
  name: string;

  /** 発表作品一覧 */
  products: Product[];

  /** 展示一覧 */
  exhibits: Exhibit[];
}

/** 発表作品 */
export interface Product extends ImageStatus {
  id: string;
}

/** 展示 */
export interface Exhibit extends ImageStatus {
  id: string;

  /** 展示名 */
  title: string;

  /** 展示場所 */
  location: string;

  /** 展示期間 */
  date: string;
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

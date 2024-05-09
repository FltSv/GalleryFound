import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression, { Options } from 'browser-image-compression';

import { db, fbCreatorConverter } from './firebase';

const creatorsPath = 'creators';

const imageCompOptions: Options = {
  fileType: 'image/png',
  maxSizeMB: 1,
  maxWidthOrHeight: 1000,
};

export async function getCreatorData(user: User) {
  const userId = user.uid;
  const creatorUrl = `https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F${user.uid}%2F`;
  const creator: Creator = {
    name: '',
    products: [],
    exhibits: [],
  };

  // Firestoreからユーザーデータを取得
  const docRef = doc(db, creatorsPath, userId).withConverter(
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
  const docRef = doc(db, creatorsPath, userId).withConverter(
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

  //todo 使用されていない画像の削除

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
    const path = `creators/${user.uid}/${crypto.randomUUID()}.png`;
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, compressedFile);

    const url = await getDownloadURL(result.ref);
    const name = result.metadata.name;
    image.srcImage = url.match(`${name}.*`)?.[0] ?? '';
  };

  const tasks = images.map(exhibit => uploadImage(exhibit));
  await Promise.all(tasks);
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

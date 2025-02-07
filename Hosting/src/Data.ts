import { User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression, { Options } from 'browser-image-compression';
import { collectionNames } from 'src/infra/firebase/firebaseConfig';
import { getUlid } from 'src/ULID';
import { ImageStatus } from 'src/domains/entities';

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

/** 住所から緯度経度を取得する */
export const getLatLngFromAddress = async (address: string) => {
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

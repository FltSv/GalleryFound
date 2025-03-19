import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { collectionNames } from 'src/infra/firebase/firebaseConfig';
import { ImageRepo } from 'src/domain/services/ImageService';
import { Exhibit, Product } from 'src/domain/entities';

type uploadImageType = ImageRepo['uploadImage'];
type uploadThumbnailType = ImageRepo['uploadThumbnail'];

export const storageCreatorsBaseUrl =
  'https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F';

const storage = getStorage();

/**
 * 画像をアップロードする
 * @returns アップロードした画像のURL
 */
const uploadImage: uploadImageType = async props => {
  const { userId, file, documentId, progressCallback } = props;
  const path = `${collectionNames.creators}/${userId}/${documentId}.png`;

  try {
    return await uploadFile(file, path, progressCallback);
  } catch (error) {
    console.error('画像のアップロードに失敗しました', error);
    throw new Error('画像のアップロードに失敗しました');
  }
};

/**
 * サムネイル画像をアップロードする
 */
const uploadThumbnail: uploadThumbnailType = async props => {
  const { userId, file, documentId, progressCallback } = props;
  const path = `${collectionNames.creators}/${userId}/thumbs/${documentId}.webp`;

  try {
    return await uploadFile(file, path, progressCallback);
  } catch (error) {
    console.error('サムネイルのアップロードに失敗しました', error);
    throw new Error('サムネイルのアップロードに失敗しました');
  }
};

const uploadFile = async (
  file: File,
  path: string,
  progressCallback?: (progress: number) => void,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);

    // アップロード開始
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        // アップロードの進行状況
        const transferred = snapshot.bytesTransferred;
        const total = snapshot.totalBytes;
        const progress = (transferred / total) * 100;

        progressCallback?.(progress);
      },
      error => {
        console.error('Upload failed', error);
        reject(error);
      },
      async () => {
        // アップロード成功後にダウンロードURLを取得
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);
        resolve(downloadURL);
      },
    );
  });

// todo: v0.6.1で削除
/** サムネイル画像のURLを取得する */
export const getThumbnailUrl = async (
  userId: string,
  item: Product | Exhibit,
) => {
  const imageName = item.srcImage.replace(/\.png.*/, '.webp');
  const path = `${collectionNames.creators}/${userId}/thumbs/${imageName}`;
  return await getDownloadURL(ref(storage, path));
};

export const FireStorageImageRepo: ImageRepo = {
  uploadImage,
  uploadThumbnail,
};

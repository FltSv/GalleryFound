import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collectionNames } from 'src/infra/firebase/firebaseConfig';
import { getUlid } from 'src/ULID';
import { ImageRepo } from 'src/domain/services/ImageService';

type uploadImageType = ImageRepo['uploadImage'];
type uploadThumbnailType = ImageRepo['uploadThumbnail'];

const storage = getStorage();

const uploadImage: uploadImageType = async (userId, file) => {
  const fileId = getUlid();
  const path = `${collectionNames.creators}/${userId}/${fileId}.png`;
  const storageRef = ref(storage, path);

  try {
    const result = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(result.ref);
    const name = result.metadata.name;

    return url.match(`${name}.*`)?.[0] ?? '';
  } catch (error) {
    console.error('画像のアップロードに失敗しました', error);
    throw new Error('画像のアップロードに失敗しました');
  }
};

const uploadThumbnail: uploadThumbnailType = async (userId, file) => {
  const fileId = getUlid();
  const path = `${collectionNames.creators}/${userId}/thumbs/${fileId}.webp`;
  const storageRef = ref(storage, path);

  try {
    await uploadBytes(storageRef, file);
  } catch (error) {
    console.error('サムネイルのアップロードに失敗しました', error);
    throw new Error('サムネイルのアップロードに失敗しました');
  }
};

export const FireStorageImageRepo: ImageRepo = {
  uploadImage,
  uploadThumbnail,
};

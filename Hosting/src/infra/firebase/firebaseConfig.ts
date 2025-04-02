import { initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { Timestamp, GeoPoint, initializeFirestore } from 'firebase/firestore';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyDqf-8M_mqa1u3nF3eY3i0eEzhZi4Wow34',
  authDomain: 'gallery-found.firebaseapp.com',
  projectId: 'gallery-found',
  storageBucket: 'gallery-found.appspot.com',
  messagingSenderId: '985501114281',
  appId: '1:985501114281:web:0e6ad563fee57fb8826eb8',
};

const reCAPTCHA_PUBLIC_KEY = '6LeS8AcqAAAAABQnEgiC2-HGfuuHFeNK_kMUD0Zq';

export const collectionNames = {
  creators: 'creators',
  galleries: 'galleries',
  products: 'products',
  exhibits: 'exhibits',
} as const;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true, // undefinedを無視してFirestoreに書き込む
});

// Remote Config
// 最小フェッチ時間: dev1分、prod1時間
const mut_config = getRemoteConfig(app);
mut_config.settings.minimumFetchIntervalMillis =
  process.env.NODE_ENV === 'development' ? 60000 : 3600000;

export const getConfig = async (): Promise<Config> => {
  await fetchAndActivate(mut_config);
  return {
    debugUserIds: JSON.parse(
      getValue(mut_config, 'debug_user_ids').asString(),
    ) as string[],
    genres: JSON.parse(getValue(mut_config, 'genres').asString()) as string[],
  };
};

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: boolean;
  }
}

if (process.env.NODE_ENV === 'development') {
  window.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(reCAPTCHA_PUBLIC_KEY),
  isTokenAutoRefreshEnabled: true,
});

getToken(appCheck)
  .then(result => {
    console.debug('appCheck Success!: ', result);
  })
  .catch((e: unknown) => {
    console.error(e);
  });

/** firestore Creator */
export interface Creator {
  name?: string;
  genre?: string;
  profile?: string;
  profileHashtags?: string[];
  links?: string[];
  highlightProductId?: string;

  /**
   * Storageのcreators/以下を格納
   * @example `{creatorId}%2F{imageId}.png?alt=media&token={token}`
   */
  highlightProductThumbPath?: string;

  products?: Product[];
  exhibits?: Exhibit[];

  /** 最終更新日 */
  updateAt: Timestamp;
}

/** firestore Product */
export interface Product extends ImageObject {
  id: string;
  title?: string;
  detail?: string;
  image: string;
  order: number;

  /** 作品の作成日 */
  //todo: v0.6.1で必須にする
  createdAt?: Timestamp;

  /** DBへの登録日 */
  //todo: v0.6.1で必須にする
  addedAt?: Timestamp;
}

/** firestore Exhibit */
export interface Exhibit extends ImageObject {
  id: string;
  title: string;
  location: string;
  galleryId: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  image: string;
}

interface ImageObject {
  /**
   * Storageのcreators/以下を格納
   * @example `{creatorId}%2F{imageId}.png?alt=media&token={token}`
   */
  imagePath?: string;

  /**
   * Storageのcreators/thumbs/以下を格納
   */
  thumbPath?: string;
}

/** firestore Gallery */
export interface Gallery {
  name: string;
  location: string;
  latLng: GeoPoint;
}

/** Remote Config */
interface Config {
  debugUserIds: string[];
  genres: string[];
}

import { initializeApp } from 'firebase/app';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  FirestoreDataConverter,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Remote Config
// 最小フェッチ時間: dev1分、prod1時間
const config = getRemoteConfig(app);
config.settings.minimumFetchIntervalMillis =
  process.env.NODE_ENV === 'development' ? 60000 : 3600000;

export const getConfig = async (): Promise<Config> => {
  await fetchAndActivate(config);
  return {
    debugUserIds: JSON.parse(
      getValue(config, 'debug_user_ids').asString(),
    ) as string[],
  };
};

export const fbCreatorConverter: FirestoreDataConverter<Creator> = {
  toFirestore: modelObject => modelObject,

  fromFirestore: (snapshot, options?) => {
    const data = snapshot.data(options);
    return data as Creator;
  },
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

export const fbGalleryConverter: FirestoreDataConverter<Gallery> = {
  toFirestore: obj => obj,
  fromFirestore: (snapshot, options?) => snapshot.data(options) as Gallery,
};

/** firestore Creator */
export interface Creator {
  name?: string;
  profile?: string;
  links?: string[];
  products?: Product[];
  exhibits?: Exhibit[];
}

/** firestore Product */
export interface Product {
  id: string;
  title?: string;
  detail?: string;
  image: string;
}

/** firestore Exhibit */
export interface Exhibit {
  id: string;
  title: string;
  location: string;
  galleryId: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
  image: string;
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
}

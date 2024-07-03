import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  FirestoreDataConverter,
  Timestamp,
  GeoPoint,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDqf-8M_mqa1u3nF3eY3i0eEzhZi4Wow34',
  authDomain: 'gallery-found.firebaseapp.com',
  projectId: 'gallery-found',
  storageBucket: 'gallery-found.appspot.com',
  messagingSenderId: '985501114281',
  appId: '1:985501114281:web:0e6ad563fee57fb8826eb8',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const fbCreatorConverter: FirestoreDataConverter<Creator> = {
  toFirestore: modelObject => modelObject,

  fromFirestore: (snapshot, options?) => {
    const data = snapshot.data(options);
    return data as Creator;
  },
};

export const fbGalleryConverter: FirestoreDataConverter<Gallery> = {
  toFirestore: obj => obj,
  fromFirestore: (snapshot, options?) => snapshot.data(options) as Gallery,
};

/** firestore Creator */
export interface Creator {
  name?: string;
  products?: Product[];
  exhibits?: Exhibit[];
}

/** firestore Product */
export interface Product {
  id: string;
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

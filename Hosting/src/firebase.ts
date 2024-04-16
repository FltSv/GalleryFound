import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// ユーザー認証状態が確定するまでのプロミス
let resolveUserAuthState: (arg: string | null) => void;
const userAuthStatePromise = new Promise<string | null>(resolve => {
  resolveUserAuthState = resolve;
});
// ログイン状態の更新で実行
onAuthStateChanged(auth, user => {
  resolveUserAuthState(user ? user.uid : null);

  if (user) {
    console.log(`Logged in! emailVerified: ${user.emailVerified}`);
  } else {
    console.log('No User.');
  }
});

/** @returns {Promise<string>} */
export const getUserId = () => userAuthStatePromise;

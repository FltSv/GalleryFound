import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

type providerTypes = 'google' | 'facebook' | 'email';

/**
 * メール・パスワードによるログイン処理
 * @param email メールアドレス
 * @param pass パスワード
 */
export async function loginWithEmail(email: string, pass: string) {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, pass);
}

/**
 * メール・パスワードによる新規登録
 * @returns
 */
export async function signupWithEmail(email: string, pass: string) {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    pass,
  );

  // メールアドレス確認メールを送信する
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

/** Googleログイン・新規登録 */
export async function loginWith(providerType: providerTypes) {
  let provider;
  switch (providerType) {
    case 'google':
      provider = new GoogleAuthProvider();
      break;

    case 'facebook':
      provider = new FacebookAuthProvider();
      break;

    default:
      throw new Error('Invalid provider type');
  }

  // ポップアップでログイン
  return await signInWithPopup(getAuth(), provider);
}

/**
 * ログアウト
 */
export async function signOut() {
  await getAuth().signOut();
}

/**
 * メールアドレス確認メールを再送信する
 */
export async function sendVerifyEmail() {
  const user = getAuth().currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
}

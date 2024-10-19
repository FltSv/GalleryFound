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
export const loginWithEmail = async (email: string, pass: string) => {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, pass);
};

/**
 * メール・パスワードによる新規登録
 * @returns
 */
export const signupWithEmail = async (email: string, pass: string) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    pass,
  );

  // メールアドレス確認メールを送信する
  await sendEmailVerification(userCredential.user);
  return userCredential;
};

/** Googleログイン・新規登録 */
export const loginWith = async (providerType: providerTypes) => {
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
  return await signInWithPopup(getAuth(), provider).catch((error: unknown) => {
    console.error(error);
  });
};

/**
 * ログアウト
 */
export const signOut = async () => {
  await getAuth().signOut();
};

/**
 * メールアドレス確認メールを再送信する
 */
export const sendVerifyEmail = async () => {
  const user = getAuth().currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
};

import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

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

/**
 * ログアウト
 */
export async function signOut() {
  await getAuth().signOut();
}

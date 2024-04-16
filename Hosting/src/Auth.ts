import {
  getAuth,
  signInWithEmailAndPassword,
  //   createUserWithEmailAndPassword,
  //   sendEmailVerification,
} from 'firebase/auth';

/**
 * メール・パスワードによるログイン処理
 * @param email メールアドレス
 * @param pass パスワード
 */
export async function loginWithEmail(email: string, pass: string) {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  // Signed in
  const user = userCredential.user;

  console.debug('ログインしたよ～: ', user);
}

/**
 * ログアウト
 */
export async function signOut() {
  await getAuth().signOut();
}

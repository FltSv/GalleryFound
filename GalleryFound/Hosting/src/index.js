//@ts-check
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { firebaseConfig } from "../key"
import { changePwdVisible, loginMail, signupMail } from "./login";

// イベント
document.addEventListener('DOMContentLoaded', (event) => {
  // パスワードの表示非表示
  document.getElementById('input-pwd-visible')?.addEventListener('change', changePwdVisible);

  // ログインボタン
  document.getElementById('login-button')?.addEventListener('click', loginMail);

  // 登録ボタン
  document.getElementById('resister-button')?.addEventListener('click', signupMail);
});
    

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ログイン状態の更新で実行
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('Logged in!');
    console.log('emailVerified: ' + user.emailVerified);
  } else {
    console.log('No User.')
  }
});

// ログアウト
// firebase.auth().signOut();
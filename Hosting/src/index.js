//@ts-check
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
const firebaseConfig = {
  apiKey: "AIzaSyDqf-8M_mqa1u3nF3eY3i0eEzhZi4Wow34",
  authDomain: "gallery-found.firebaseapp.com",
  projectId: "gallery-found",
  storageBucket: "gallery-found.appspot.com",
  messagingSenderId: "985501114281",
  appId: "1:985501114281:web:0e6ad563fee57fb8826eb8"
};

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

  // ログインボタン等の表示切り替え
  const isLogin = user !== null

  // ログイン中のみ表示
  const logoutButton = document.getElementById('header-logout-button')
  if (logoutButton) {
    logoutButton.style.display = isLogin ? "block" : "none";
  }

  const mypageButton = document.getElementById('header-mypage-button')
  if (mypageButton) {
    mypageButton.style.display = isLogin ? "block" : "none";
  }

  // ログアウト中のみ表示
  const loginButton = document.getElementById('header-login-button')
  if (loginButton) {
    loginButton.style.display = isLogin ? "none" : "block";
  }
});

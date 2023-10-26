//@ts-check
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

// パスワードの表示非表示を切替
export function changePwdVisible() {
  const setType = this.checked ? 'text' : 'password';
  document.getElementById('input-pwd')?.setAttribute('type', setType);
  document.getElementById('input-pwd-confirm')?.setAttribute('type', setType);
}

// ログイン
export function loginMail() {
  const id = getInputValue('input-id');
  const pwd = getInputValue('input-pwd');

  if (!validationIdPwd(id, pwd, pwd)) {
    return;
  }

  signInWithEmailAndPassword(getAuth(), id, pwd)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

    console.log("ログインしたよ～");
    transitionPage("/mypage");
  })
  .catch((error) => {
    showError(error);
    return;
  });
}

// 新規登録
export async function signupMail() {
  const id = getInputValue('input-id');
  const pwd = getInputValue('input-pwd');
  const pwd2 = getInputValue('input-pwd-confirm');

  if (!validationIdPwd(id, pwd, pwd2)) {
    return;
  }

  const auth = getAuth()
  await createUserWithEmailAndPassword(auth, id, pwd)
  .then(userCredential => {
    // Signed in 
    const user = userCredential.user;

    console.log("createUser" + user);
  })
  .catch((error) => {
    showError(error);
    return;
  });

  // いったんメールアドレス・パスワードでログインし、未認証ならば確認メールを送信する
  //const currentUser = firebase.auth().currentUser;
  const currentUser = auth.currentUser;
  if (currentUser === null) {
    console.log("currentUser is null");
    return;
  }

  if (currentUser.emailVerified) {
    console.log("currentUser is Verified");
    return;
  }

  await sendEmailVerification(currentUser).then(() => {
    console.log("sendEmailVerification");
  }).catch((error) => {
    showError(error);
    return;
  });
  
  // 上記における「url」欄のリンクをユーザーが踏むと期待される。
  // 踏んだ先のページに対するリクエストが投げられるので、
  // その先でリクエストのGETパラメーターのうち「oobCode」をキーとする値(文字列)を取得する。
  // それをapplyActionCodeメソッドに渡せば、正常終了時、メールアドレスの確認が完了する
  try {
    // ワンタイムコードの確認
    //await auth().applyActionCode(oobCode);
    // メールアドレスの確認完了
  } catch (e) {
    // applyActionCodeのエラー
    console.error(e)
    showErrorMsg(e);
    return;
  };

  console.log("新規登録でログインしたよ～");
  window.location.href = "/login/sendverify.html";
}

/**
 * 認証状態により、ページ移動のハンドリングを行う
 * メールアドレス認証が行われていない場合、
 * @param {string} link
 */
function transitionPage(link) {
  const auth = getAuth()
  const currentUser = auth.currentUser;

  // ログイン状態でなければ、ログインページに移動
  if (currentUser === null) {
    window.location.href = '/login';
    console.log("currentUser is null");
    return;
  }

  // 認証済みでなければ、確認を促すページに移動
  if (!currentUser.emailVerified) {
    window.location.href = '/login/noverified.html';
    console.log("currentUser is not Verified");
    return;
  }

  // 認証済みの場合、正常にページ移動を行う
  window.location.href = link;
}

/**
 * HTMLInputElementから値を取得
 * @param {string} elementId
 */
function getInputValue(elementId) {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLInputElement)) {
    return "";
  }
  return element.value;
}

// 入力チェック
function validationIdPwd(id, pwd, pwd2) {
  if (id === "") {
    showErrorMsg("メールアドレスを入力してください。");
    return false;
  }

  if (pwd === "") {
    showErrorMsg("パスワードを入力してください。");
    return false;
  }

  if (pwd !== pwd2 ) {
    showErrorMsg("入力されたパスワードが異なります。");
    return false;
  }

  return true;
}

// エラーメッセージを表示
function showError(error) {
  const code = error.code;
  const msg = error.message;
  const errorMsg = `エラー！${code}: ${msg}`;

  console.log(`${code}: ${msg}`);
  showErrorMsg(errorMsg);
}

/**
 * @param {string} errorMsg
 */
function showErrorMsg(errorMsg) {
  const errorLabel = document.getElementById('login-error-msg');
  if (errorLabel) {
    errorLabel.textContent = errorMsg
  }
}

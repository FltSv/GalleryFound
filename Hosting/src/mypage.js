//@ts-check
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db, getUserId } from "./index";
import * as htmlHelper from "./lib/htmlHelper";

const creatorsPath = "creators";
const creatorNameId = "creator-name";
const presHistoryId = "presented-history";

document.addEventListener('DOMContentLoaded', async () => {
  if (!document.body.classList.contains('page-mypage')) {
    return;
  }

  const userId = await getUserId();
 
  // ログインしていない場合、ログインページに飛ばす
  if (!userId) {
    window.location.href = '/login';
    return;
  }

  // マイページ表示時にデータのロード
  await loadMypage(userId).catch(error => {
    console.error("loadMypage().catch:", error);
  });

  // バリデーション
  const nameInput = document.getElementById(creatorNameId);
  nameInput?.addEventListener("input", validateCheck);
  validate(nameInput);

  // 確定ボタン
  const button = document.getElementById('submit-button');
  button?.addEventListener('click', async () => {
    // 入力値の取得
    const name = htmlHelper.getInputValue(creatorNameId);
    const presentedHistory = htmlHelper.getInputValue(presHistoryId);

    // 入力チェック
    if (!name) {
      validate(nameInput);
      return;
    }

    await setDoc(doc(db, creatorsPath, userId), {
      name: name,
      presHistory: presentedHistory
    });

    // 処理完了
    console.log("確定ボタン処理したよ");
    window.location.href = '/mypage';
  });
});

/**
 * ページの読み込み時にDBからデータをロードする
 * @param {string} userId
 */
async function loadMypage(userId) {
  // Firestoreからユーザーデータを取得
  await getDoc(doc(db, creatorsPath, userId)).then(docSnap => {
    // 作家情報が存在しているか
    if (!docSnap.exists()) {
      // 存在しない場合、情報は空のままで登録を促す
      console.log("情報ないよー");
      return;
    }

    // ドキュメントが存在する場合、詳細を取得
    const data = docSnap.data();
    console.log("データ:", data);

    // 既存情報の反映
    htmlHelper.setInputValue(creatorNameId, docSnap.get("name"));
    htmlHelper.setInputValue(presHistoryId, docSnap.get("presHistory"));

  }).catch(error => {
    console.error("エラー:", error);
  });
}

/**
 * バリデーションを行い、確定ボタンの有効無効を切り替える
 * @param {Event} e 
 */
function validateCheck(e) {
  const input = e.target;
  if (!(input instanceof HTMLElement)) {
    return;
  }

  validate(input);
}

const validate = (/** @type {HTMLElement?} */ input) => {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }    

  const isValid = input.value != "" // カスタムルール
  const invalidMsg = 'このフィールドを空にすることはできません。'
  input.setCustomValidity(isValid ? "" : invalidMsg);

  input.checkValidity();

  const button = document.getElementById('submit-button');
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  button.disabled = !isValid;
  
  const errMsgSpan = document.getElementById('errorMsg');
  if (errMsgSpan) {
    errMsgSpan.textContent = isValid ? "" : input.validationMessage
  }
};
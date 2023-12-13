//@ts-check
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db, getUserId } from "./index";

const creatorsPath = "creators";

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
  loadMypage(userId).catch(error => {
    console.error("loadMypage().catch:", error);
  });

  // 確定ボタン
  const button = document.getElementById('submit-button');
  button?.addEventListener('click', async () => {
    //todo 入力チェック

    await setDoc(doc(db, creatorsPath, userId), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });

    // 処理完了
    console.log("確定ボタン処理したよ");
  });
});

/**
 * ページの読み込み時にDBからデータをロードする
 */
async function loadMypage(userId) {
  // Firestoreからユーザーデータを取得
  getDoc(doc(db, creatorsPath, userId)).then(docSnap => {
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
    setInputValue("creator-name", docSnap.get("name"));

  }).catch(error => {
    console.error("エラー:", error);
  });
}


/**
 * HTMLInputElementへ値を設定
 * @param {string} elementId
 * @param {string} value
 */
function setInputValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLInputElement)) {
    return;
  }
  element.value = value;
}

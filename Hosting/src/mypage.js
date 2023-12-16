//@ts-check
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import imageCompression from "browser-image-compression";

import { db, getUserId } from "./index";
import * as htmlHelper from "./lib/htmlHelper";

const creatorsPath = "creators";
const creatorNameId = "creator-name";
const presHistoryId = "presented-history";
const presProductsId = "presented-products";
const selectedImagesId = "selected-images";

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

  // ファイル選択ボタン
  const selectFileButton = document.getElementById(presProductsId);
  selectFileButton?.addEventListener('change', showPreview);

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

    // 画像のアップロード
    await uploadImages(htmlHelper.getInputFiles(presProductsId));

    // DB更新
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

/**
 * 選択した画像のプレビューを表示
 */
async function showPreview() {
  const imagesContainer = document.getElementById(selectedImagesId);
  if (!imagesContainer) {
    return;
  }

  imagesContainer.innerHTML = ''; // 以前の画像をクリア

  const files = htmlHelper.getInputFiles(presProductsId)
  if (!files) {
    return;
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      continue;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result?.toString();
      if (!src) {
        return;
      }

      const img = document.createElement('img');
      img.src = src;
      imagesContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Cloud Storageへの画像アップロードを行う
 * @param {FileList?} files
 */
async function uploadImages(files) {
  console.log("start uploadImages");
  if (!files) {
    console.log("not selected file");
    return;
  }

  const options = {
    maxSizeMB: 1,
    fileType: "image/png"
  };

  try {
    const storage = getStorage();
    for (const file of files) {
      const compressedFile = await imageCompression(file, options);
      console.log("start upload:", file);

      const userId = await getUserId();
      const storageRef = ref(storage, `creators/${userId}/${crypto.randomUUID()}.png`);
      await uploadBytes(storageRef, compressedFile).then(snapshot => {
        console.log('Uploaded a file!', snapshot);
      });
    }
  
    console.log("Upload successful");
  } catch (error) {
    console.error(error);
  }
}

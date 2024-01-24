//@ts-check
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, listAll, getBlob } from "firebase/storage";
import imageCompression from "browser-image-compression";

import { db, getUserId } from "./index";
import * as htmlHelper from "./lib/htmlHelper";

const creatorsPath = "creators";
const creatorNameId = "creator-name";
const presHistoryId = "presented-history";
const presProductsId = "presented-products";
const selectedImagesId = "selected-images";
const presProductListId = "presented-product-images";

const exhibitNameId = "exhibit-name";
const exhibitLocId = "exhibit-location";
const exhibitDateId = "exhibit-period";
const exhibitImgId = "exhibit-img-fileinput";
const exhibitImgPrevId = "exhibit-img-preview";
const exhibitConfirmButtonId = "add-exhibit-row-button";
const confirmTypeAttr = "confirm-type";
const exhibitIdAttr = "exhibit-id";

/**
 * 展示登録の内部配列
 * @type {Exhibit[]}
 */
const tmpExhibits = [];


// イベントの登録
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

  // popupイベントハンドラの登録
  document.getElementById("presented-resister-button")?.addEventListener('click', showAddExhibitPopup);

  document.querySelectorAll(".popup-close").forEach(element => {
    element.addEventListener('click', closeExhibitPopup);
  });

  const exhibitImgInputId = 'exhibit-img-fileinput';
  document.getElementById(exhibitImgInputId)?.addEventListener('change', async () => {
    const files = await htmlHelper.getInputFileSrcs(exhibitImgInputId);

    const exhibitPreviewImg = document.getElementById("exhibit-img-preview");
    if (exhibitPreviewImg instanceof HTMLImageElement) {
      exhibitPreviewImg.src = files ? files[0] : "";
    }
  });

  const addExhibitRowButton = document.getElementById(exhibitConfirmButtonId);
  addExhibitRowButton?.addEventListener('click', () => {
    switch (addExhibitRowButton?.getAttribute(confirmTypeAttr)) {
      case "add":
        addExhibitRow();
        return;

      case "edit":
        editExhibitRow(addExhibitRowButton?.getAttribute(exhibitIdAttr) ?? "");
        return;

      default: return;
    }
  });


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
      presHistory: presentedHistory,
      //exhibits: tmpExhibits
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
  await getDoc(doc(db, creatorsPath, userId)).then(async docSnap => {
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

    // 発表作品のロード、表示
    const listRef = ref(getStorage(), getPresProductsPath(userId));
    try {
      const presProductList = document.getElementById(presProductListId);
      if (!presProductList) {
        return;
      }

      const res = await listAll(listRef);
      for (const itemRef of res.items) {
        const blob = await getBlob(itemRef)
        const url = URL.createObjectURL(blob);
  
        const img = document.createElement('img');
        img.src = url;
  
        presProductList.appendChild(img);
      }
    } catch (error) {
      console.error("Error listing files:", error);
    }

    // 展示登録
    //todo
    viewExhibitsTable();
    
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
      const storageRef = ref(storage, `${getPresProductsPath(userId)}/${crypto.randomUUID()}.png`);
      await uploadBytes(storageRef, compressedFile).then(snapshot => {
        console.log('Uploaded a file!', snapshot);
      });
    }
  
    console.log("Upload successful");
  } catch (error) {
    console.error(error);
  }
}

function getPresProductsPath(userId) {
  return `creators/${userId}/presProducts`;
}

/**
 * Jsからpopupの表示を切り替える
 * @param {boolean} isVisible
 */
function changePopup(isVisible) {
  const popupCheckbox = document.getElementById("popup");
  if (popupCheckbox instanceof HTMLInputElement) {
    popupCheckbox.checked = isVisible;
  }
}

/**
 * 展示登録の追加画面を開く
 */
function showAddExhibitPopup() {
  htmlHelper.setInnerHTML('popup-title', '展示登録');
  htmlHelper.setInnerHTML(exhibitConfirmButtonId, '<i class="fa-solid fa-add"></i> 追加')
  document.getElementById(exhibitConfirmButtonId)?.setAttribute(confirmTypeAttr, "add");

  changePopup(true);
}

/**
 * 展示登録に編集画面を開く 
 * @param {Exhibit} exhibit
 */
function showEditExhibitPopup(exhibit) {
  htmlHelper.setInnerHTML('popup-title', '展示修正');
  htmlHelper.setInnerHTML(exhibitConfirmButtonId, '<i class="fa-solid fa-check"></i> 変更'); //fixme
  document.getElementById(exhibitConfirmButtonId)?.setAttribute(confirmTypeAttr, "edit");
  document.getElementById(exhibitConfirmButtonId)?.setAttribute(exhibitIdAttr, exhibit.getId());

  // exhibitクラスをpopupに適用
  htmlHelper.setInputValue(exhibitNameId, exhibit.title);
  htmlHelper.setInputValue(exhibitLocId, exhibit.location);
  htmlHelper.setInputValue(exhibitDateId, exhibit.date);
  document.getElementById(exhibitImgPrevId)?.setAttribute('src', exhibit.getImageSrc());

  // popupを表示
  changePopup(true);
}

/**
 * 展示登録画面を閉じる
 */
function closeExhibitPopup() {
  changePopup(false);

  // popupの内容リセット
  [exhibitNameId, exhibitLocId, exhibitDateId, exhibitImgId].map(x => {
    htmlHelper.setInputValue(x, "");
  });

  // 画像のリセット
  var imgElement = document.getElementById(exhibitImgPrevId);
  imgElement?.setAttribute('src', '');
}

/**
 * 展示登録popupの内容を確定、tmpExhibitsに追加する
 */
async function addExhibitRow() {
  const exhibit = new Exhibit();
  exhibit.title = htmlHelper.getInputValue(exhibitNameId);
  exhibit.location = htmlHelper.getInputValue(exhibitLocId);
  exhibit.date = htmlHelper.getInputValue(exhibitDateId);

  const files = await htmlHelper.getInputFileSrcs(exhibitImgId);
  exhibit.imageData = files ? files[0] : "";

  // 値のチェック
  if (!checkExhibit(exhibit)) {
    return;
  }
  
  tmpExhibits.push(exhibit);

  // テーブル更新
  viewExhibitsTable();
  
  // popupを閉じる
  closeExhibitPopup();
}

/**
 * 展示登録popupの内容を変更
 * @param {string} exhibitId
 */
async function editExhibitRow(exhibitId) {
  const exhibit = tmpExhibits.find(x => x.getId() === exhibitId);
  if (!exhibit) {
    return;
  }

  exhibit.title = htmlHelper.getInputValue(exhibitNameId);
  exhibit.location = htmlHelper.getInputValue(exhibitLocId);
  exhibit.date = htmlHelper.getInputValue(exhibitDateId);

  const files = await htmlHelper.getInputFileSrcs(exhibitImgId);
  if (files) {
    exhibit.imageData = files[0];
  }

  // 値のチェック
  if (!checkExhibit(exhibit)) {
    return;
  }

  // テーブル更新
  viewExhibitsTable();
  
  // popupを閉じる
  closeExhibitPopup();
}

function checkExhibit(exhibit) {
  const popupErrMsg = document.getElementById("popup-err-msg");
  if (!popupErrMsg) {
    return false;
  }

  if (!exhibit.checkValues()) {
    //todo 各項目にエラーを出す
    popupErrMsg.innerHTML = "未入力項目があります。";
    return false;
  }

  popupErrMsg.innerHTML = "";
  return true;
}

// 編集ボタンにイベントリスナーを追加
// document.querySelectorAll('.exhibit-button-col .edit').forEach((button, i) => {
  // button.addEventListener('click', () => {
      // クリックされたボタンが属する行のデータを取得
      // const exhibit = tmpExhibits[i];

      // ポップアップウィンドウを更新
      // htmlHelper.setInputValue('exhibit-name',exhibit.title);
      // htmlHelper.setInputValue('exhibit-location',exhibit.location);
      // htmlHelper.setInputValue('exhibit-period',exhibit.date);
      // htmlHelper.setInputValue('exhibit-img-preview',exhibit.image);

      // ポップアップウィンドウを表示
      // changePopup(true);
  // });
// });

/**
 * HTMLテーブルを一時配列と同期させる
 */
function viewExhibitsTable() {
  const table = document.getElementById("exhibits-table");
  if (!(table instanceof HTMLTableElement)) {
    return;
  }

  // テーブル初期化
  table.innerHTML = '';

  // 配列が0であれば、Emptyメッセージを示す
  const emptyMsg = tmpExhibits.length === 0 ? '展示登録がありません' : '';
  htmlHelper.setInnerHTML('exhibits-table-msg', emptyMsg);

  // 配列の中身を表示
  for (const exhibit of tmpExhibits) {
    const tr = table.insertRow(-1);

    // 画像セルを作成
    const imgCell = tr.insertCell(0);
    imgCell.className = 'exhibit-image-col';
    const img = document.createElement('img');
    img.src = exhibit.getImageSrc();
    imgCell.appendChild(img);

    // 内容セルを作成
    const contentCell = tr.insertCell(1);
    contentCell.className = 'exhibit-content-col';
    contentCell.innerHTML = `<p>${exhibit.title}</p><p>${exhibit.location}</p><p>${exhibit.date}</p>`;

    // ボタンセルを作成
    const buttonCell = tr.insertCell(2);
    buttonCell.className = 'exhibit-button-col';

    const editButton = document.createElement('button');
    editButton.textContent = '編集';
    editButton.addEventListener('click', () => showEditExhibitPopup(exhibit));
    buttonCell.appendChild(editButton);

    buttonCell.appendChild(document.createElement('br'));
    buttonCell.appendChild(document.createElement('br'));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    buttonCell.appendChild(deleteButton);
  }
}

/**
 * 展示
 */
class Exhibit {
  #id = "";

  /**
   * 展示名
   * @type {string}
   */
  title = "";

  /**
   * 展示場所
   * @type {string}
   */
  location = "";

  /**
   * 展示期間
   * @type {string}
   */
  date = "";

  /**
   * 展示イメージ
   * @type {string}
   */
  imageData = "";

  /**
   * 展示イメージ
   * @type {string}
   */
  imageUrl = "";

  /**
   * @param {string?} id 
   */
  constructor(id = null) {
    this.#id = id ?? crypto.randomUUID();
  }

  getId() {
    return this.#id;
  }

  getImageSrc() {
    return this.imageUrl == "" ? this.imageData : this.imageUrl;
  }

  /**
   * 値のチェックを行う
   * @returns {boolean}
   */
  checkValues() {
    if (this.title == "") {
      return false;
    }
    if (this.location == "") {
      return false;
    }
    if (this.date == "") {
      return false;
    }

    return true;
  }

  // todo 日時の自然言語チェック
}

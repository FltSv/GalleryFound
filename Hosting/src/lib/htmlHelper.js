//@ts-check

/**
 * HTMLInputElementから値を取得
 * @param {string} elementId
 * @returns {string}
 */
export function getInputValue(elementId) {
  const element = document.getElementById(elementId);
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element.value;
  }
  return '';
}

/**
 * HTMLInputElementへ値を設定
 * @param {string} elementId
 * @param {string} value
 */
export function setInputValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    element.value = value;
    return true;
  }
  return false;
}

/**
 * ファイル選択ボタンから選択されたファイルを取得
 * @param {string} elementId
 * @returns {FileList?}
 */
export function getInputFiles(elementId) {
  const element = document.getElementById(elementId);
  if (element instanceof HTMLInputElement) {
    return element.files;
  }
  return null;
}

/**
 *
 * @param {string} elementId
 * @param {string} value
 * @returns {boolean}
 */
export function setInnerHTML(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = value;
    return true;
  }
  return false;
}
/**
 * ファイル選択ボタンから選択されたファイルの内容を取得
 * @param {string} elementId
 * @returns {Promise<string[]?>}
 */
export async function getInputFileSrcs(elementId) {
  const files = getInputFiles(elementId);
  if (!files) {
    return null;
  }

  /** type {string[]} */
  const filePaths = [];

  const promises = Array.from(files).map(
    async file =>
      await new Promise(resolve => {
        const reader = new FileReader();

        reader.onload = () => {
          const src = reader.result?.toString();
          if (src) {
            filePaths.push(src);
            resolve(0);
          }
        };

        reader.readAsDataURL(file);
      }),
  );

  await Promise.all(promises);
  return filePaths.length > 0 ? filePaths : null;
}

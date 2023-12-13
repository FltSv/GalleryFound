//@ts-check

/**
 * HTMLInputElementから値を取得
 * @param {string} elementId
 * @returns {string}
 */
export function getInputValue(elementId) {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLInputElement)) {
    return "";
  }
  return element.value;
}

/**
 * HTMLInputElementへ値を設定
 * @param {string} elementId
 * @param {string} value
 */
export function setInputValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (!(element instanceof HTMLInputElement)) {
    return;
  }
  element.value = value;
}

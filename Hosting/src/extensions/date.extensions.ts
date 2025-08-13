/* eslint-disable functional/immutable-data */

declare global {
  interface Date {
    /**
     * DateオブジェクトをYYYY-MM-DD形式の文字列に変換
     * @returns YYYY-MM-DD形式の文字列
     */
    toInputDateString: () => string;

    /**
     * DateオブジェクトをYYYY/MM/DD形式の文字列に変換
     * @returns YYYY/MM/DD形式の文字列
     */
    toDisplayDateString: () => string;
  }
}

Date.prototype.toInputDateString = function () {
  // YYYY-MM-DD形式の文字列とするため、en-CAを使用
  return this.toLocaleDateString('en-CA', { timeZone: 'UTC' });
};

Date.prototype.toDisplayDateString = function () {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  };
  return this.toLocaleDateString('ja-JP', options);
};

export {};

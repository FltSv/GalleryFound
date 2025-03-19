/** 日付の期間の表示値を返す */
export const getDatePeriodString = (start: Date, end: Date) => {
  const startString = start.toLocaleDateString();
  const endString = end.toLocaleDateString();
  return `${startString} ～ ${endString}`;
};

import { useState, useCallback } from 'react';
import { unstable_usePrompt, useBeforeUnload } from 'react-router-dom';

/**
 * フォームの状態を管理し、未保存の変更がある場合にページ離脱を防止するためのカスタムフック
 * 1. フォームの変更状態の管理
 * 2. 未保存の変更がある場合のページ離脱防止（ブラウザの閉じる/更新時）
 * 3. 未保存の変更がある場合のSPA内ページ遷移防止
 * 4. フォーム送信後の状態リセット
 *
 * @returns {Object} フォームの状態とその更新関数を含むオブジェクト
 * @property markAsDirty - フォームに未保存の変更があることを示す関数
 * @property markAsClean - フォームの変更が保存されたことを示す関数
 *
 * @example
 * ```tsx
 * const { markAsDirty, markAsClean } = useFormGuard();
 *
 * // フォームの変更を検知したとき
 * useEffect(() => {
 *   markAsDirty();
 * }, [formData]);
 *
 * // フォーム送信成功時
 * const onSubmit = async () => {
 *   await saveData();
 *   markAsClean();
 * };
 * ```
 *
 * @remarks
 * - このフックはブラウザの標準的な確認ダイアログを使用します
 * - ダイアログのメッセージはブラウザによって異なる場合があります
 * - モダンブラウザでは、カスタムメッセージを設定することはできません
 */
export const useFormGuard = () => {
  const [isDirty, setIsDirty] = useState(false);

  // ブラウザの閉じる/更新時の処理
  useBeforeUnload(
    useCallback(
      e => {
        if (isDirty) {
          e.preventDefault();
        }
      },
      [isDirty],
    ),
  );

  // SPA内のページ遷移時の処理
  unstable_usePrompt({
    message: '行った変更が保存されない可能性があります。',
    when: ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  });

  const markAsDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markAsClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  return { markAsDirty, markAsClean };
};

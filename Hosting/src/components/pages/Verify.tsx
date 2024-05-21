export const SendVerify = () => (
  <div className="mx-auto flex w-full max-w-xl flex-col items-center">
    <h2>確認メールを送信しました！</h2>
    <p>Gallery Foundにご登録頂き、ありがとうございます。</p>
    <p>ご登録のメールアドレスに確認メールを送信しました。</p>
    <p>24時間以内に確認メールに記載されている認証リンクをクリックして、</p>
    <p>メールアドレスの登録を完了してください。</p>
  </div>
);

export const NoVerify = () => (
  <div className="mx-auto flex w-full max-w-xl flex-col items-center">
    <h2>メールアドレスの確認が完了していません。</h2>
    <p>ご登録のメールアドレスに送信された確認メールに記載されている</p>
    <p>認証リンクをクリックして、メールアドレスの登録を完了してください。</p>
    {/* todo: 確認メールを再送信する処理を追加 */}
  </div>
);

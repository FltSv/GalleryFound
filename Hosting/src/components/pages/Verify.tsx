import { useState } from 'react';
import { sendVerifyEmail } from 'src/Auth';

const divStyle = 'mx-auto flex w-full max-w-xl flex-col items-center';
const h1Style = 'my-2 md:my-6 text-2xl md:text-3xl font-bold text-black';

export const SendVerify = () => {
  const [isResent, setIsResent] = useState(false);

  return isResent ? (
    <ReSent />
  ) : (
    <div className={divStyle}>
      <h1 className={h1Style}>確認メールを送信しました！</h1>
      <p className="my-4 text-lg text-gray-800">
        Gallery Foundにご登録頂き、ありがとうございます。
        <br className="hidden md:block" />
        ご登録のメールアドレスに確認メールを送信しました。
      </p>
      <p className="my-4 text-gray-800">
        24時間以内に確認メールに記載されている認証リンクをクリックして、
        メールアドレスの登録を完了してください。
      </p>
      <p className="text-gray-800">
        受信フォルダ内に確認メールが見当たらない場合は、迷惑メールフォルダもご確認ください。
      </p>
      <ReSendLink
        setter={() => {
          setIsResent(true);
        }}
      />
    </div>
  );
};

export const NoVerify = () => {
  const [isResent, setIsResent] = useState(false);

  return isResent ? (
    <ReSent />
  ) : (
    <div className={divStyle}>
      <h1 className={h1Style}>確認メールの認証が完了していません。</h1>
      <p className="my-4 text-gray-800">
        ご登録のメールアドレスに送信された確認メールに記載されている認証リンクをクリックして、メールアドレスの登録を完了してください。
      </p>
      <p className="text-gray-800">
        受信フォルダ内に確認メールが見当たらない場合は、迷惑メールフォルダもご確認ください。
      </p>
      <ReSendLink
        setter={() => {
          setIsResent(true);
        }}
      />
    </div>
  );
};

export const ReSent = () => (
  <div className={divStyle}>
    <h1 className={h1Style}>確認メールを再送信しました！</h1>
    <p className="my-4 text-gray-800">
      24時間以内に確認メールに記載されている認証リンクをクリックして、
      メールアドレスの登録を完了してください。
    </p>
    <p className="text-gray-800">
      受信フォルダ内に確認メールが見当たらない場合は、迷惑メールフォルダもご確認ください。
    </p>
  </div>
);

const ReSendLink = (props: { setter: () => void }) => {
  return (
    <a
      href="#"
      className="my-8 text-blue-600"
      onClick={() =>
        void (async () => {
          // 確認メールを再送信
          await sendVerifyEmail();

          // ReSentページに遷移
          props.setter();
        })()
      }>
      確認メールを再送信する
    </a>
  );
};

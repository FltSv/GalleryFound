import { CSSProperties } from 'react';

const screenshot: CSSProperties = {
  //@apply mx-4 w-40,
  margin: '0 1rem',
  width: '10rem',
  clipPath: 'inset(0 0 25% 0)' /* 上部4/5を表示 */,
  maskImage: 'linear-gradient(to bottom, black 10%, transparent)',
};

export const Top = () => (
  <>
    <p className="text-xl my-8">
      いつでもどこでも簡単にギャラリーを見つけられるアプリ。
    </p>

    <div className="flex items-center">
      <img src="img/app-screen-1.png" style={screenshot} />
      <div>
        <h2>ギャラリーリスト</h2>
        <p>手軽なリストで情報整理。一目で分かりやすく。</p>
      </div>
    </div>

    <div className="flex items-center flex-row-reverse">
      <img src="img/app-screen-2.png" style={screenshot} />
      <div>
        <h2>地図機能</h2>
        <p>
          場所の確認に最適 <br />
          お出かけの際に近くのギャラリーを探せます。
        </p>
      </div>
    </div>

    <div className="flex items-center">
      <img src="img/Screenshot_20231215-150650.png" style={screenshot} />
      <div>
        <h2>雑誌リスト</h2>
        <p>美術雑誌も一目で分かりやすく。</p>
      </div>
    </div>

    <div className="flex items-center flex-row-reverse">
      <img src="img/Screenshot_20231215-150642.png" style={screenshot} />
      <div>
        <h2>作家リスト</h2>
        <p>気になってるあの作家を一覧で見れる！</p>
      </div>
    </div>
    <div className="flex gap-4">
      <div className="relative">
        <a
          href="#"
          target="_blank"
          className="pointer-events-none cursor-default opacity-50">
          <img src="img/google-play-badge_JP.png" className="h-16 m-2" />
        </a>
        <div className="absolute bg-black bg-opacity-50 text-white p-1 bottom-0">
          準備中
        </div>
      </div>
      <div className="relative">
        <a
          href="#"
          target="_blank"
          className="pointer-events-none cursor-default opacity-50">
          <img src="img/DownloadAppStore_JP.svg" className="h-16 m-2" />
        </a>
        <div className="absolute bg-black bg-opacity-50 text-white p-1 bottom-0">
          準備中
        </div>
      </div>
    </div>
  </>
);

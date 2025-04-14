import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const screenshot: CSSProperties = {
  margin: '0 1rem',
  maskImage: 'linear-gradient(to bottom, black 50%, transparent)',
};

export const Top = () => (
  <div className="mx-auto flex w-full max-w-xl flex-col">
    <p className="mb-8 text-xl">
      いつでもどこでも簡単にギャラリーを見つけられるアプリ。
    </p>

    <div className="flex items-center">
      <img
        className={`
          w-24
          md:w-40
        `}
        src="img/exhibit-screen.png"
        style={screenshot}
      />
      <div>
        <h2>ギャラリーリスト</h2>
        <p>手軽なリストで情報整理。一目で分かりやすく。</p>
      </div>
    </div>

    <div className="flex flex-row-reverse items-center">
      <img
        className={`
          w-24
          md:w-40
        `}
        src="img/map-screen.png"
        style={screenshot}
      />
      <div>
        <h2>地図機能</h2>
        <p>
          場所の確認に最適 <br />
          お出かけの際に近くのギャラリーを探せます。
        </p>
      </div>
    </div>

    {/* todo 画面ができたら差し替える */}
    {/* <div className="flex items-center">
      <img
        src="img/Screenshot_20231215-150650.png"
        style={screenshot}
        className="w-24 md:w-40"
      />
      <div>
        <h2>雑誌リスト</h2>
        <p>美術雑誌も一目で分かりやすく。</p>
      </div>
    </div> */}

    <div className="flex items-center">
      <img
        className={`
          w-24
          md:w-40
        `}
        src="img/creator-screen.png"
        style={screenshot}
      />
      <div>
        <h2>作家リスト</h2>
        <p>気になってるあの作家を一覧で見れる！</p>
      </div>
    </div>

    {/* アプリDLボタン */}
    <div
      className={`
        mx-auto my-16 flex gap-1
        md:gap-4
      `}>
      <div className="relative">
        <a
          className="pointer-events-none cursor-default opacity-50"
          href="#"
          target="_blank">
          <img
            className={`
              m-2 h-12 object-contain
              md:h-16
            `}
            src="img/google-play-badge_JP.png"
          />
        </a>
        <div className="absolute bottom-0 bg-black/50 p-1 text-white">
          準備中
        </div>
      </div>
      <div className="relative">
        <a
          className="pointer-events-none cursor-default opacity-50"
          href="#"
          target="_blank">
          <img
            className={`
              m-2 h-12 object-contain
              md:h-16
            `}
            src="img/DownloadAppStore_JP.svg"
          />
        </a>
        <div className="absolute bottom-0 bg-black/50 p-1 text-white">
          準備中
        </div>
      </div>
    </div>
    <div className="mx-auto">
      <Link to="Policy">プライバシーポリシー・利用規約</Link>
    </div>
  </div>
);

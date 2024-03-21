export const Top = () => (
  <>
    <p className="desc-message">
      いつでもどこでも簡単にギャラリーを見つけられるアプリ。
    </p>

    <div className="app-description left-align">
      <img src="img/app-screen-1.png" className="screenshot" />
      <div className="description-text">
        <h2>ギャラリーリスト</h2>
        <p>手軽なリストで情報整理。一目で分かりやすく。</p>
      </div>
    </div>

    <div className="app-description right-align">
      <img src="img/app-screen-2.png" className="screenshot" />
      <div className="description-text">
        <h2>地図機能</h2>
        <p>
          場所の確認に最適 <br />
          お出かけの際に近くのギャラリーを探せます。
        </p>
      </div>
    </div>

    <div className="app-description left-align">
      <img src="img/Screenshot_20231215-150650.png" className="screenshot" />
      <div className="description-text">
        <h2>雑誌リスト</h2>
        <p>美術雑誌も一目で分かりやすく。</p>
      </div>
    </div>

    <div className="app-description right-align">
      <img src="img/Screenshot_20231215-150642.png" className="screenshot" />
      <div className="description-text">
        <h2>作家リスト</h2>
        <p>気になってるあの作家を一覧で見れる！</p>
      </div>
    </div>
    <ul id="dl-buttons">
      <li>
        <div className="image-link-wrapper">
          <a href="#" target="_blank" className="disabled-link">
            <img src="img/google-play-badge_JP.png" />
          </a>
          <div className="overlay-text">準備中</div>
        </div>
      </li>
      <li>
        <div className="image-link-wrapper">
          <a href="#" target="_blank" className="disabled-link">
            <img src="img/DownloadAppStore_JP.svg" />
          </a>
          <div className="overlay-text">準備中</div>
        </div>
      </li>
    </ul>
  </>
);

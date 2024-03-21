export const Mypage = () => (
  <>
    <div className="div-left-align">
      <h2>My Page</h2>
      <p>表示作家名</p>
      <input type="text" id="creator-name" />
      <span id="errorMsg"></span>

      <p>展示歴</p>
      <textarea id="presented-history" rows={5} cols={40}></textarea>

      <p>発表作品</p>
      <div id="presented-product-images" className="presImages"></div>
      <input type="file" multiple id="presented-products" accept="image/*" />
      <div id="selected-images" className="presImages"></div>

      <p>展示登録</p>
      <div id="exhibits-table-msg"></div>
      <table id="exhibits-table"></table>
      <button type="button" id="presented-resister-button">
        展示を登録する
      </button>
      {/* <!-- <label htmlFor="popup">[debug] show popup</label> --> */}

      <p>
        <br />
      </p>

      <button
        type="button"
        id="submit-button"
        className="login-button login-mail">
        <i className="fa-solid fa-check"></i> 確定
      </button>

      {/* <!-- popup window --> */}
      <input type="checkbox" id="popup" />
      <div className="popup-overlay">
        <div className="popup-window">
          <label className="popup-close">
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="0"
                y1="0"
                x2="18"
                y2="18"
                stroke="white"
                strokeWidth="3"></line>
              <line
                x1="0"
                y1="18"
                x2="18"
                y2="0"
                stroke="white"
                strokeWidth="3"></line>
            </svg>
          </label>
          <h2 id="popup-title">展示登録</h2>
          <div className="flex-area">
            <div className="innerflex-half-area">
              <input type="file" id="exhibit-img-fileinput" accept="image/*" />
              <img id="exhibit-img-preview" />
            </div>
            <div className="innerflex-half-area">
              <p>
                展示名
                <br />
                <input type="text" id="exhibit-name" />
              </p>
              <p>
                場所
                <br />
                <input type="text" id="exhibit-location" />
              </p>
              <p>
                日時
                <br />
                <input type="text" id="exhibit-period" />
              </p>
            </div>
          </div>
          <div id="popup-err-msg"></div>
          <button id="add-exhibit-row-button"></button>
        </div>
      </div>
    </div>
  </>
);

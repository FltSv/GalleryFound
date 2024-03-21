export const Login = () => (
  <>
    <ul id="login-buttons">
      <li>
        <h2>Log in</h2>
      </li>
      <li>
        <input
          type="text"
          id="input-id"
          className="input-form"
          placeholder="メールアドレス"
        />
      </li>
      <li>
        <input
          type="password"
          className="input-form"
          id="input-pwd"
          placeholder="パスワード"
        />
      </li>
      <li>
        <div>
          <input type="checkbox" id="input-pwd-visible" />
          <label>パスワードを表示する</label>
        </div>
      </li>
      <li>
        <p id="login-error-msg" className="login-error"></p>
      </li>
      <li>
        <button
          type="button"
          id="login-button"
          className="login-button login-mail">
          <i className="fa-regular fa-envelope login-iconfont"></i>
          メールアドレスでログイン
        </button>
      </li>

      {/* ソーシャルログイン */}
      <li>
        <a href="" className="login-button login-google">
          <i className="fa-brands fa-google login-iconfont"></i>Googleでログイン
        </a>
      </li>

      {/* 新規登録 */}
      <li>
        <p>
          <br />
        </p>
      </li>
      <li>
        <p>--- アカウントをお持ちでない方はこちら ---</p>
      </li>
      <li>
        <a href="/login/resister.html" className="login-button login-register">
          新規登録
        </a>
      </li>
    </ul>
  </>
);

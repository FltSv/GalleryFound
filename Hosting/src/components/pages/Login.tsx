import { SubmitButton, Textbox } from '../ui/Input';

export const Login = () => (
  <form
    id="login-buttons"
    className="flex flex-col justify-center gap-2 p-0 w-fit">
    <h2>Log in</h2>
    <Textbox type="text" id="input-id" placeholder="メールアドレス" />
    <Textbox type="password" id="input-pwd" placeholder="パスワード" />
    <div>
      <input type="checkbox" id="input-pwd-visible" />
      <label>パスワードを表示する</label>
    </div>
    <p
      id="login-error-msg"
      className="login-error flex text-red-600 text-xs"></p>
    <SubmitButton
      iconClass="fa-regular fa-envelope"
      id="login-button"
      addClass="text-white bg-orange-500">
      メールアドレスでログイン
    </SubmitButton>

    {/* ソーシャルログイン */}
    <h2 className="mt-8">--- 外部アカウントでログイン ---</h2>
    <SubmitButton
      iconClass="fa-brands fa-google"
      id="login-google"
      addClass="text-white bg-blue-500">
      Googleでログイン
    </SubmitButton>

    {/* 新規登録 */}
    <h2 className="mt-8">--- アカウントをお持ちでない方はこちら ---</h2>
    <SubmitButton id="login-register" addClass="text-black bg-white">
      新規登録
    </SubmitButton>
    {/* <a href="/login/resister.html" className="login-button login-register">
      新規登録
    </a> */}
  </form>
);

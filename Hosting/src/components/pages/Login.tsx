import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Button, Textbox } from '../ui/Input';
import { loginWithEmail } from '../../Auth';

type LoginButtonIds = 'login-button' | 'login-google' | 'login-register';

interface Inputs {
  mail: string;
  password: string;
  visiblePwd: boolean;
}

export const Login = () => {
  const [loginButtonId, setLoginButtonId] = useState<LoginButtonIds>();
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const visiblePwd = watch('visiblePwd', false);

  const onValid: SubmitHandler<Inputs> = async data => {
    console.debug(`submitted: ${loginButtonId}`);

    try {
      await loginWithEmail(data.mail, data.password);
      navigate('/mypage');
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        setLoginErrorMsg(error.message);
      }
    }
  };

  const onClick = (id: LoginButtonIds) => {
    console.debug(`onClick: ${id}`);
    setLoginButtonId(id);
  };

  const reqMessage = 'このフィールドは入力必須です。';

  return (
    <form
      id="login-buttons"
      className="flex flex-col justify-center gap-2 p-0 w-fit"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onValid)}>
      <h2>Log in</h2>
      <div>
        <Textbox
          type="text"
          id="input-id"
          placeholder="メールアドレス"
          {...register('mail', {
            required: reqMessage,
          })}
        />
        <p className="text-red-600 text-xs">{errors.mail?.message}</p>
      </div>
      <div>
        <Textbox
          type={visiblePwd ? 'text' : 'password'}
          id="input-pwd"
          placeholder="パスワード"
          {...register('password', {
            required: reqMessage,
          })}
        />
        <p className="text-red-600 text-xs">{errors.password?.message}</p>
      </div>
      <div>
        <input type="checkbox" {...register('visiblePwd')} />
        <label>パスワードを表示する</label>
      </div>
      <Button
        type="submit"
        iconClass="fa-regular fa-envelope"
        id={'login-button' as LoginButtonIds}
        addClass="text-white bg-orange-500"
        onClick={() => { onClick('login-button'); }}>
        メールアドレスでログイン
      </Button>
      <p className="text-red-600">{loginErrorMsg}</p>

      {/* ソーシャルログイン */}
      <h2 className="mt-8">--- 外部アカウントでログイン ---</h2>
      <Button
        type="button"
        iconClass="fa-brands fa-google"
        id={'login-google' as LoginButtonIds}
        addClass="text-white bg-blue-500"
        onClick={() => { onClick('login-google'); }}>
        Googleでログイン
      </Button>

      {/* 新規登録 */}
      <h2 className="mt-8">--- アカウントをお持ちでない方はこちら ---</h2>
      <Button
        type="button"
        id={'login-register' as LoginButtonIds}
        addClass="text-black bg-white"
        onClick={() => { onClick('login-register'); }}>
        新規登録
      </Button>
      {/* <a href="/login/resister.html" className="login-button login-register">
      新規登録
    </a> */}
    </form>
  );
};

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Button, Textbox } from '../ui/Input';
import { loginWithEmail, signupWithEmail } from '../../Auth';
import { useAuthContext } from '../AuthContext';

interface Inputs {
  mail: string;
  password: string;
  passCheck: string;
  visiblePwd: boolean;
}

interface LoginState {
  isRegister: boolean;
}

function isLoginState(value: unknown): value is LoginState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<keyof LoginState, unknown>;
  const loginState: LoginState = {
    isRegister: false,
  };
  return typeof record.isRegister === typeof loginState.isRegister;
}

export const Login = () => {
  const { user, loading } = useAuthContext();
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  if (loading) {
    return <p>Now loading...</p>;
  }

  // 既にログインしている場合、mypageに移動
  if (user?.emailVerified) {
    return <Navigate replace to={'/mypage'} />;
  }

  const isRegister = isLoginState(location.state) && location.state.isRegister;
  const actionText = isRegister ? '登録' : 'ログイン';

  const visiblePwd = watch('visiblePwd', false);

  const onValid: SubmitHandler<Inputs> = async data => {
    try {
      if (isRegister) {
        // 新規登録
        await signupWithEmail(data.mail, data.password);
        navigate('/sendverify');
      } else {
        // ログイン
        await loginWithEmail(data.mail, data.password);
        navigate('/mypage');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        setLoginErrorMsg(error.message);
      }
    }
  };

  const reqMessage = 'このフィールドは入力必須です。';

  return (
    <form
      className="flex flex-col justify-center gap-2 p-0 w-fit"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onValid)}>
      <h2>{isRegister ? 'Register' : 'Log in'}</h2>
      <div>
        <Textbox
          type="text"
          autoComplete="username"
          placeholder="メールアドレス"
          {...register('mail', {
            required: reqMessage,
            pattern: {
              value: /^[\w.+-]+@([\w-]+\.)+[a-zA-Z]{2,4}$/,
              message: '正しいメールアドレスを入力してください。',
            },
          })}
        />
        <p className="text-red-600 text-xs">{errors.mail?.message}</p>
      </div>
      <div>
        <Textbox
          type={visiblePwd ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="パスワード"
          {...register('password', {
            required: reqMessage,
          })}
        />
        <p className="text-red-600 text-xs">{errors.password?.message}</p>
      </div>
      {isRegister && (
        <div>
          <Textbox
            type={visiblePwd ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="パスワード（確認）"
            {...register('passCheck', {
              required: reqMessage,
              validate: value =>
                value === watch('password') || 'パスワードが一致しません',
            })}
          />
          <p className="text-red-600 text-xs">{errors.passCheck?.message}</p>
        </div>
      )}
      <div>
        <input type="checkbox" {...register('visiblePwd')} />
        <label>パスワードを表示する</label>
      </div>
      <Button
        type="submit"
        iconClass="fa-regular fa-envelope"
        addClass="text-white bg-orange-500">
        メールアドレスで{actionText}
      </Button>
      <p className="text-red-600">{loginErrorMsg}</p>
      {/* ソーシャルログイン */}
      {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        false && (
          <>
            {/* 実装まで非表示 */}
            <h2 className="mt-8">--- 外部アカウントで{actionText} ---</h2>
            <Button
              type="button"
              iconClass="fa-brands fa-google"
              addClass="text-white bg-blue-500">
              Googleで{actionText}
            </Button>
          </>
        )
      }
      {/* 新規登録 */}
      {!isRegister && (
        <>
          <h2 className="mt-8">--- アカウントをお持ちでない方はこちら ---</h2>
          <Button
            type="button"
            addClass="text-black bg-white"
            onClick={() => {
              navigate('/login', { state: { isRegister: true } as LoginState });
            }}>
            新規登録
          </Button>
        </>
      )}
    </form>
  );
};

import { FormEvent, useCallback, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Divider, Checkbox } from '@mui/joy';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FirebaseError } from 'firebase/app';
import { Button, SubmitButton, Textbox } from '../ui/Input';
import { loginWithEmail, loginWith, signupWithEmail } from '../../Auth';
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

const isLoginState = (value: unknown): value is LoginState => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<keyof LoginState, unknown>;
  const loginState: LoginState = {
    isRegister: false,
  };
  return typeof record.isRegister === typeof loginState.isRegister;
};

export const Login = () => {
  const { user, loading } = useAuthContext();
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const isRegister = isLoginState(location.state) && location.state.isRegister;

  const onValid: SubmitHandler<Inputs> = useCallback(
    async data => {
      setIsSubmitting(true);
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
        setIsSubmitting(false);
      }
    },
    [isRegister, navigate],
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      handleSubmit(onValid)(e);
    },
    [handleSubmit, onValid],
  );

  const loginWithGoogle = useCallback(() => {
    loginWith('google');
  }, []);

  const loginWithFacebook = useCallback(() => {
    loginWith('facebook');
  }, []);

  if (loading) {
    return <p>Now loading...</p>;
  }

  // 既にログインした上でメール認証済の場合、mypageに移動
  if (user?.emailVerified ?? false) {
    return <Navigate replace to="/mypage" />;
  }

  const actionText = isRegister ? 'sign up' : 'rogin';

  const visiblePwd = watch('visiblePwd', false);

  const reqMessage = 'このフィールドは入力必須です。';

  return (
    <form
      className="mx-auto flex flex-col items-center gap-8"
      onSubmit={onSubmit}>
      <div className="flex w-full max-w-xs flex-col gap-4">
        <Textbox
          autoComplete="username"
          className="rounded-full"
          label="メールアドレス"
          {...register('mail', {
            required: reqMessage,
            pattern: {
              value: /^[\w.+-]+@([\w-]+\.)+[a-zA-Z]{2,4}$/,
              message: '正しいメールアドレスを入力してください。',
            },
          })}
          fieldError={errors.mail}
        />
        <Textbox
          autoComplete="current-password"
          className="rounded-full"
          label="パスワード"
          type={visiblePwd ? 'text' : 'password'}
          {...register('password', {
            required: reqMessage,
            minLength: { value: 6, message: '6文字以上で入力してください。' },
          })}
          fieldError={errors.password}
        />
        {isRegister && (
          <Textbox
            autoComplete="new-password"
            className="rounded-full"
            label="パスワード（確認）"
            type={visiblePwd ? 'text' : 'password'}
            {...register('passCheck', {
              required: reqMessage,
              validate: value =>
                value === watch('password') || 'パスワードが一致しません',
            })}
            fieldError={errors.passCheck}
          />
        )}
        <Checkbox
          color="neutral"
          label="パスワードを表示する"
          variant="outlined"
          {...register('visiblePwd')}
          sx={{
            '& span, span:hover': {
              backgroundColor: 'transparent',
              borderColor: 'black',
            },
          }}
        />
        <SubmitButton
          className="w-full bg-gradient-to-r from-fuchsia-400 to-indigo-500 font-redhatdisp text-white"
          loading={isSubmitting}>
          {actionText}
        </SubmitButton>
        {loginErrorMsg.length > 0 && (
          <p className="text-red-600">{loginErrorMsg}</p>
        )}
      </div>

      {/* ソーシャルログイン */}
      <Divider className="text-base">or</Divider>
      <div className="flex gap-4">
        <Button
          className="w-fit bg-white text-black"
          onClick={loginWithGoogle}
          startDecorator={<FcGoogle />}>
          Continue with Google
        </Button>
        {/* 法人化が必要そうなので非表示 */}
        <Button
          className="hidden w-fit bg-white text-black"
          onClick={loginWithFacebook}
          startDecorator={<FaFacebook color="#1877F2" />}>
          Continue with Facebook
        </Button>
      </div>

      {/* 新規登録 */}
      {!isRegister && (
        <p>
          新規登録は
          <Link
            className="text-blue-800 underline"
            state={{ isRegister: true } as LoginState}
            to="/login">
            こちら
          </Link>
        </p>
      )}
    </form>
  );
};

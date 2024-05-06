import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// page
import { Top } from './components/pages/Top';
import { Login } from './components/pages/Login';
import { Mypage } from './components/pages/Mypage';
import { SendVerify, NoVerify } from './components/pages/Verify';
import { NotFound } from './components/pages/NotFound';

// ui
import Header from './components/ui/Header';
import Logo from './components/ui/Logo';

import { useAuthContext } from './components/AuthContext';
import { ReactNode } from 'react';

const AuthRouting = (props: { page: ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p>Now loading...</p>;
  }

  // 未ログインの場合
  if (user === null) {
    return <Navigate replace to={'/login'} />;
  }

  // メール認証がまだ
  if (!user.emailVerified) {
    return <NoVerify />;
  }

  return props.page;
};

const App = () => (
  <BrowserRouter>
    <Header />
    <div className="flex flex-col items-center mx-auto pb-8 max-w-xl">
      <Logo />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="login" element={<Login />} />
        <Route path="sendverify" element={<SendVerify />} />
        <Route path="mypage" element={<AuthRouting page={<Mypage />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;

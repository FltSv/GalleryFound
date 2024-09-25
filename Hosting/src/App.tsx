import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// page
import { Top } from './components/pages/Top';
import { Login } from './components/pages/Login';
import { Mypage } from './components/pages/Mypage';
import { Galleries } from './components/pages/Galleries';
import { SendVerify, NoVerify } from './components/pages/Verify';
import { NotFound } from './components/pages/NotFound';

// ui
import Header from './components/ui/Header';

import { useAuthContext } from './components/AuthContext';
import { ReactNode } from 'react';
import { Policy } from './components/pages/Policy';

const AuthRouting = (props: { page: ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p>Now loading...</p>;
  }

  // 未ログインの場合
  if (user === null) {
    return <Navigate replace to="/login" />;
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
    <div className="mx-4 pb-8 md:mx-10">
      <Routes>
        <Route element={<Top />} path="/" />
        <Route element={<Login />} path="login" />
        <Route element={<SendVerify />} path="sendverify" />
        <Route element={<AuthRouting page={<Mypage />} />} path="mypage" />
        <Route
          element={<AuthRouting page={<Galleries />} />}
          path="galleries"
        />
        <Route element={<Policy />} path="policy" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;

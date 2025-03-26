import { ReactNode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import ReactGA from 'react-ga4';

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
import { Policy } from './components/pages/Policy';
import { ErrorBoundaryProvider } from './providers/ErrorBoundaryProvider';

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

const Layout = () => (
  <>
    <Header />
    <ErrorBoundaryProvider>
      <div
        className={`
          mx-4 pb-8

          md:mx-10
        `}>
        <Outlet />
      </div>
    </ErrorBoundaryProvider>
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Top />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'sendverify',
        element: <SendVerify />,
      },
      {
        path: 'mypage',
        element: <AuthRouting page={<Mypage />} />,
      },
      {
        path: 'galleries',
        element: <AuthRouting page={<Galleries />} />,
      },
      {
        path: 'policy',
        element: <Policy />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => {
  ReactGA.initialize('G-GLSP40W377');
  return <RouterProvider router={router} />;
};

export default App;

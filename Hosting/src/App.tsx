import { ReactNode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import ReactGA from 'react-ga4';

// page
import { Top } from 'src/pages/Top';
import { Login } from 'src/pages/Login';
import { Logout } from 'src/pages/Logout';
import { Mypage } from 'src/pages/Mypage';
import { Galleries } from 'src/pages/Galleries';
import { SendVerify, NoVerify } from 'src/pages/Verify';
import { NotFound } from 'src/pages/NotFound';
import { Policy } from 'src/pages/Policy';

// ui
import { Header } from 'components/Header';
import { useAuthContext } from 'src/contexts/AuthContext';
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
        path: 'logout',
        element: <Logout />,
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

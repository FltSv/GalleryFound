import { ReactNode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
  useLoaderData,
} from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Top } from 'src/pages/Top';
import { Login } from 'src/pages/Login';
import { Logout } from 'src/pages/Logout';
import { Mypage } from 'src/pages/Mypage';
import { Galleries } from 'src/pages/Galleries';
import { SendVerify, NoVerify } from 'src/pages/Verify';
import { Maintenance } from 'src/pages/Maintenance';
import { NotFound } from 'src/pages/NotFound';
import { Policy } from 'src/pages/Policy';
import { Header } from 'components/Header';
import { AuthProvider, useAuthContext } from 'src/contexts/AuthContext';
import { CreatorProvider } from 'src/contexts/CreatorContext';
import { ErrorBoundaryProvider } from 'src/providers/ErrorBoundaryProvider';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Config, getConfig } from 'src/infra/firebase/firebaseConfig';
import { Env } from './Env';

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

const Layout = () => {
  const location = useLocation();
  const isTopPage = location.pathname === '/';

  const data = useLoaderData() as Config | undefined;
  const isMaintenance = data?.isMaintenance === true;

  const children = isMaintenance && !isTopPage ? <Maintenance /> : <Outlet />;

  return (
    <>
      <Header />
      <ErrorBoundaryProvider>
        <div
          className={`
            mx-4 pb-8
            md:mx-10
          `}>
          {children}
        </div>
      </ErrorBoundaryProvider>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: getConfig,
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

export const App = () => {
  ReactGA.initialize('G-GLSP40W377');
  return (
    <AuthProvider>
      <CreatorProvider>
        <APIProvider apiKey={Env.MAPS_JS_API}>
          <RouterProvider router={router} />
        </APIProvider>
      </CreatorProvider>
    </AuthProvider>
  );
};

import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from 'src/contexts/AuthContext';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';

export interface MenuProps {
  visibleLogin: boolean;
  visibleLogout: boolean;
  visibleMypage: boolean;
}

export const Header = () => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  const isLogged = user !== null;

  const visibleLogin = !isLogged && location.pathname !== '/login';
  const visibleMypage = isLogged && location.pathname !== '/mypage';
  const visibleLogout = isLogged;

  return (
    <header className="mb-4 flex gap-4 p-4">
      <div className="inline-block w-full">
        <h1
          className={`
            mb-4 font-magneto text-4xl

            md:text-5xl
          `}>
          <Link to="/">Gallery Found</Link>
        </h1>
      </div>
      {loading ? null : (
        <div className="inline-block">
          <MobileMenu
            visibleLogin={visibleLogin}
            visibleLogout={visibleLogout}
            visibleMypage={visibleMypage}
          />
          <DesktopMenu
            visibleLogin={visibleLogin}
            visibleLogout={visibleLogout}
            visibleMypage={visibleMypage}
          />
        </div>
      )}
    </header>
  );
};

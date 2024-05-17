import { Link, useLocation } from 'react-router-dom';
import { signOut } from '../../Auth';
import { useAuthContext } from '../AuthContext';

const Header = () => {
  const styles =
    'px-4 py-2 border border-solid border-current rounded-3xl no-underline transition hover:bg-sky-200 hover:bg-opacity-60';

  const { user, loading } = useAuthContext();
  const location = useLocation();

  const isLogged = user !== null;

  const visibleLoginButton = !isLogged && location.pathname !== '/login';
  const visibleMypage = isLogged && location.pathname !== '/mypage';
  const visibleLogout = isLogged;

  const onSignOut = () => {
    void signOut();
  };

  return (
    <header className="mb-4 p-4">
      <div className="inline-block">
        <h1 className="mb-4 font-magneto text-5xl">
          <Link to="/">Gallery Found</Link>
        </h1>
      </div>
      {loading ? (
        <></>
      ) : (
        <div className="float-right inline-block">
          <div className="flex gap-4">
            {visibleLoginButton && (
              <Link to="login" className={styles}>
                Creator Login
              </Link>
            )}
            {visibleMypage && (
              <Link to="/mypage" className={styles}>
                MyPage
              </Link>
            )}
            {visibleLogout && (
              <Link onClick={onSignOut} to="/" className={styles}>
                Logout
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

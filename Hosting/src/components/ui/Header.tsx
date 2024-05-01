import { Link } from 'react-router-dom';
import { signOut } from '../../Auth';
import { useAuthContext } from '../AuthContext';

const Header = () => {
  const styles =
    'px-4 py-2 mx-1 my-0 border border-solid border-neutral-950 rounded-3xl text-neutral-950 no-underline transition hover:bg-sky-200';

  const { user, loading } = useAuthContext();

  if (loading) {
    return <></>;
  }

  const isLogged = user !== null;

  const onSignOut = () => {
    void signOut();
  };

  return (
    <header className="flex justify-end items-center px-5 py-3">
      {!isLogged && (
        <Link to="login" className={styles}>
          Creator Login
        </Link>
      )}
      {isLogged && (
        <Link to="/mypage" className={styles}>
          MyPage
        </Link>
      )}
      {isLogged && (
        <Link onClick={onSignOut} to="/" className={styles}>
          Logout
        </Link>
      )}
    </header>
  );
};

export default Header;

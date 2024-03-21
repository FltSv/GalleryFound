import { Link } from 'react-router-dom';

const Header = () => {
  const styles =
    'px-4 py-2 mx-1 my-0 border border-solid border-neutral-950 rounded-3xl text-neutral-950 no-underline transition hover:bg-sky-200';
  return (
    <header className="flex justify-end items-center px-5 py-3">
      <Link
        id="header-login-button"
        to="login"
        className={styles}
        style={{ display: 'none' }}>
        Creator Login
      </Link>
      <Link
        id="header-mypage-button"
        to="/mypage"
        className={styles}
        style={{ display: 'none' }}>
        MyPage
      </Link>
      <Link
        id="header-logout-button"
        to="/"
        className={styles}
        style={{ display: 'none' }}>
        Logout
      </Link>
    </header>
  );
};

export default Header;

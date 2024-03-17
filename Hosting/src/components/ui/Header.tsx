const Header = () => {
  const styles =
    'px-4 py-2 mx-1 my-0 border border-solid border-neutral-950 rounded-3xl text-neutral-950 no-underline transition hover:bg-sky-200';
  return (
    <header className="flex justify-end items-center px-5 py-3">
      <a
        id="header-login-button"
        href="/login"
        className={styles}
        style={{ display: 'none' }}>
        Creator Login
      </a>
      <a
        id="header-mypage-button"
        href="/mypage"
        className={styles}
        style={{ display: 'none' }}>
        MyPage
      </a>
      <a
        id="header-logout-button"
        href="/"
        className={styles}
        style={{ display: 'none' }}>
        Logout
      </a>
    </header>
  );
};

export default Header;

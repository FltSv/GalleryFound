const Header = () => {
  return (
    <header>
      <a
        id="header-login-button"
        href="/login"
        className="rounded-button"
        style={{ display: 'none' }}>
        Creator Login
      </a>
      <a
        id="header-mypage-button"
        href="/mypage"
        className="rounded-button"
        style={{ display: 'none' }}>
        MyPage
      </a>
      <a
        id="header-logout-button"
        href="/"
        className="rounded-button"
        style={{ display: 'none' }}>
        Logout
      </a>
    </header>
  );
};

export default Header;

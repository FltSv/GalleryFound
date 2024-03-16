const Header = () => {
  return (
    <h1 className="text-7xl mb-4 no-underline font-dancing">
      <a href="/">Gallery Found</a>
    </h1>
    <header>

    <a
      id="header-login-button"
      href="/login"
      class="rounded-button"
      style="display: none"
      >Creator Login</a
    >
    <a
      id="header-mypage-button"
      href="/mypage"
      class="rounded-button"
      style="display: none"
      >MyPage</a
    > <a
        id="header-logout-button"
        href="/"
        class="rounded-button"
        style="display: none"
        >Logout</a
      >
    </header>
  );
};

export default Header;

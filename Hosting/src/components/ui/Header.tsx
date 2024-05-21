import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, Dropdown, IconButton } from '@mui/joy';
import { FaBars } from 'react-icons/fa';
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
    <header className="mb-4 flex gap-4 p-4">
      <div className="inline-block w-full">
        <h1 className="mb-4 font-magneto text-4xl md:text-5xl">
          <Link to="/">Gallery Found</Link>
        </h1>
      </div>
      {loading ? (
        <></>
      ) : (
        <div className="inline-block">
          {/* アイコンメニュー */}
          <div className="md:hidden">
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: { variant: 'outlined', color: 'transparent' },
                }}>
                <FaBars />
              </MenuButton>
              <Menu
                placement="bottom-end"
                sx={{
                  border: 0,
                  backgroundColor: '#FFF4',
                  backdropFilter: 'blur(8px)',
                }}>
                {visibleLoginButton && (
                  <MenuItem>
                    <Link to="login">Creator Login</Link>
                  </MenuItem>
                )}
                {visibleMypage && (
                  <MenuItem>
                    <Link to="/mypage">MyPage</Link>
                  </MenuItem>
                )}
                {visibleLogout && (
                  <MenuItem>
                    <Link onClick={onSignOut} to="/">
                      Logout
                    </Link>
                  </MenuItem>
                )}
              </Menu>
            </Dropdown>
          </div>

          {/* ボタンメニュー */}
          <div className="hidden gap-4 md:flex">
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

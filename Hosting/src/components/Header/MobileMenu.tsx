import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, Dropdown, IconButton } from '@mui/joy';
import { MdKeyboardArrowDown, MdLogin } from 'react-icons/md';
import { MenuProps } from '.';
import { CreatorImage } from 'components/CreatorImage';

export const MobileMenu = ({
  visibleLogin,
  visibleLogout,
  visibleMypage,
}: MenuProps) => {
  // 未ログインの場合はログインボタンを表示
  if (visibleLogin) {
    return (
      <Link className="md:hidden" to="login">
        <div className="flex flex-col items-center justify-center">
          <MdLogin size={32} />
          <span className="text-center text-xs text-gray-800">LOGIN</span>
        </div>
      </Link>
    );
  }

  // ログイン済みの場合はメニューボタンを表示
  const visibleMenu = visibleMypage || visibleLogout;

  return (
    <div className="md:hidden">
      <Dropdown>
        {visibleMenu && (
          <MenuButton
            slotProps={{
              root: { variant: 'outlined', color: 'transparent' },
            }}
            slots={{ root: IconButton }}>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center">
                <CreatorImage />
                <MdKeyboardArrowDown
                  className={`
                    absolute bottom-0 right-0 rounded-full bg-white/80
                  `}
                  size={16}
                />
              </div>
              <p className="text-xs text-gray-800">MENU</p>
            </div>
          </MenuButton>
        )}
        <Menu
          placement="bottom-end"
          sx={{
            border: 0,
            backgroundColor: '#FFF4',
            backdropFilter: 'blur(8px)',
          }}>
          {visibleMypage && (
            <MenuItem>
              <Link to="/mypage">MyPage</Link>
            </MenuItem>
          )}
          {visibleLogout && (
            <MenuItem>
              <Link to="/logout">Logout</Link>
            </MenuItem>
          )}
        </Menu>
      </Dropdown>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, Dropdown, IconButton } from '@mui/joy';
import { FaBars } from 'react-icons/fa';
import { MenuProps } from '.';

export const MobileMenu = ({
  visibleLogin,
  visibleLogout,
  visibleMypage,
}: MenuProps) => {
  const visibleMenu = visibleLogin || visibleMypage || visibleLogout;

  return (
    <div className="md:hidden">
      <Dropdown>
        {visibleMenu && (
          <MenuButton
            slotProps={{
              root: { variant: 'outlined', color: 'transparent' },
            }}
            slots={{ root: IconButton }}>
            <FaBars />
          </MenuButton>
        )}
        <Menu
          placement="bottom-end"
          sx={{
            border: 0,
            backgroundColor: '#FFF4',
            backdropFilter: 'blur(8px)',
          }}>
          {visibleLogin && (
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
              <Link to="/logout">Logout</Link>
            </MenuItem>
          )}
        </Menu>
      </Dropdown>
    </div>
  );
};

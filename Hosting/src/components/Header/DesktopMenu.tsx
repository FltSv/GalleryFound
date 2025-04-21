import { Link } from 'react-router-dom';
import { MenuProps } from '.';

export const DesktopMenu = ({
  visibleLogin,
  visibleLogout,
  visibleMypage,
}: MenuProps) => {
  const styles = `
    rounded-3xl border border-solid border-current px-4 py-2 text-nowrap
    no-underline transition
    hover:bg-sky-200/60
  `;

  return (
    <div
      className={`
        hidden gap-4
        md:flex
      `}>
      {visibleLogin && (
        <Link className={styles} to="login">
          Creator Login
        </Link>
      )}
      {visibleMypage && (
        <Link className={styles} to="/mypage">
          MyPage
        </Link>
      )}
      {visibleLogout && (
        <Link className={styles} to="/logout">
          Logout
        </Link>
      )}
    </div>
  );
};

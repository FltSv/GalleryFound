import { Link, useLocation } from 'react-router-dom';
import { useCreatorContext } from 'src/contexts/CreatorContext';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';

export interface MenuProps {
  visibleLogin: boolean;
  visibleMypage: boolean;
  visibleLogout: boolean;
}

export const Header = () => {
  const { creator, loading } = useCreatorContext();
  const location = useLocation();

  const isLogged = creator !== null;

  const menuProps: MenuProps = {
    visibleLogin: !isLogged && location.pathname !== '/login',
    visibleMypage: isLogged && location.pathname !== '/mypage',
    visibleLogout: isLogged,
  };

  return (
    <header className="mb-4 flex gap-4 p-4">
      <div className="inline-block w-full">
        <h1
          className={`
            mb-4 font-magneto text-4xl

            md:text-5xl
          `}>
          <Link to="/">Gallery Found</Link>
        </h1>
      </div>
      {loading ? null : (
        <div className="inline-block">
          <MobileMenu {...menuProps} />
          <DesktopMenu {...menuProps} />
        </div>
      )}
    </header>
  );
};

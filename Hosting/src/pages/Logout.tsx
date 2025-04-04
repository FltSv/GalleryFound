import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'src/Auth';
import { useAuthContext } from 'components/AuthContext';

export const Logout = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      void (async () => await signOut())();
    }

    navigate('/');
  }, [user, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>ログアウト中...</p>
    </div>
  );
};

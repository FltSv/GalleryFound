import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/infra/firebase/firebaseConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);

      if (user) {
        console.debug(`Logged in! emailVerified: ${user.emailVerified}`);
      } else {
        console.debug('No User.');
      }
    });
    return unsubscribed;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
};

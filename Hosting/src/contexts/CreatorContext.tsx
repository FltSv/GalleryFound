import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { User } from 'firebase/auth';
import { Creator } from 'src/domain/entities';
import { getCreatorData } from 'src/infra/firebase/CreatorRepo';
import { useAuthContext } from './AuthContext';

interface CreatorContextType {
  creator: Creator | null;
  loading: boolean;
  refetch: () => Promise<void>;
  update: (updatedCreator: Creator) => void;
}

const CreatorContext = createContext<CreatorContextType>({
  creator: null,
  loading: true,
  refetch: async () => {},
  update: () => {},
});

export const useCreatorContext = () => useContext(CreatorContext);

export const CreatorProvider = (props: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuthContext();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCreator = async (user: User | null) => {
    if (user === null) {
      setCreator(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const creatorData = await getCreatorData(user);
      setCreator(creatorData);
    } catch (error) {
      console.error('Failed to fetch creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      void fetchCreator(user);
    }
  }, [user, authLoading]);

  const refetch = async () => {
    if (user) {
      await fetchCreator(user);
    }
  };

  const update = (updatedCreator: Creator) => {
    setCreator(updatedCreator);
  };

  return (
    <CreatorContext.Provider value={{ creator, loading, refetch, update }}>
      {props.children}
    </CreatorContext.Provider>
  );
};

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../../types/user';

type InputMethod = 'upload' | 'text' | null;

interface FrenchIdolContextType {
  displayStoryUpload: boolean;
  storyText: string;
  inputMethod: InputMethod;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setDisplayStoryUpload: (display: boolean) => void;
  setStoryText: (text: string) => void;
  setInputMethod: (method: InputMethod) => void;
}

const defaultContext: FrenchIdolContextType = {
  displayStoryUpload: true,
  storyText: '',
  inputMethod: null,
  currentUser: null,
  isLoading: false,
  error: null,
  setDisplayStoryUpload: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  setStoryText: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  setInputMethod: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
};

export const FrenchIdolContext = createContext<FrenchIdolContextType>(defaultContext);

interface FrenchIdolProviderProps {
  children: ReactNode;
}

export function FrenchIdolProvider({ children }: FrenchIdolProviderProps) {
  const [displayStoryUpload, setDisplayStoryUpload] = useState(true);
  const [storyText, setStoryText] = useState('');
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/getByEmail?email=vincent@gmail.com`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setCurrentUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
        console.error('Error loading user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const value = {
    displayStoryUpload,
    storyText,
    inputMethod,
    currentUser,
    isLoading,
    error,
    setDisplayStoryUpload,
    setStoryText,
    setInputMethod,
  };

  return <FrenchIdolContext.Provider value={value}>{children}</FrenchIdolContext.Provider>;
}

export function useFrenchIdol() {
  const context = useContext(FrenchIdolContext);
  if (context.setDisplayStoryUpload === defaultContext.setDisplayStoryUpload) {
    throw new Error('useFrenchIdol must be used within a FrenchIdolProvider');
  }
  return context;
}

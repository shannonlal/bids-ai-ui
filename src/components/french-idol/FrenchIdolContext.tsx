import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../../types/user';
import { Story } from '../../types/story';

type InputMethod = 'upload' | 'text' | null;

interface FrenchIdolContextType {
  displayStoryUpload: boolean;
  storyText: string;
  inputMethod: InputMethod;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  stories: Story[];
  setDisplayStoryUpload: (display: boolean) => void;
  setStoryText: (text: string) => void;
  setInputMethod: (method: InputMethod) => void;
  resetForm: () => void;
}

const defaultContext: FrenchIdolContextType = {
  displayStoryUpload: true,
  storyText: '',
  inputMethod: null,
  currentUser: null,
  isLoading: false,
  error: null,
  stories: [],
  setDisplayStoryUpload: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  setStoryText: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  setInputMethod: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  resetForm: () => {
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
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load user
        const userResponse = await fetch(`/api/users/getByEmail?email=vincent@gmail.com`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await userResponse.json();
        setCurrentUser(userData.user);

        // Load unread stories
        const storiesResponse = await fetch(`/api/stories/list?email=vincent@gmail.com&read=false`);
        if (!storiesResponse.ok) {
          throw new Error('Failed to fetch stories');
        }
        const storiesData = await storiesResponse.json();
        setStories(storiesData.stories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const resetForm = () => {
    setStoryText('');
    setInputMethod(null);
    setDisplayStoryUpload(true);
  };

  const value = {
    displayStoryUpload,
    storyText,
    inputMethod,
    currentUser,
    isLoading,
    error,
    stories,
    setDisplayStoryUpload,
    setStoryText,
    setInputMethod,
    resetForm,
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

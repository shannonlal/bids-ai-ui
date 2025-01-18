import { createContext, useContext, ReactNode, useState } from 'react';

interface FrenchIdolContextType {
  displayStoryUpload: boolean;
  storyText: string;
  setDisplayStoryUpload: (display: boolean) => void;
  setStoryText: (text: string) => void;
}

const defaultContext: FrenchIdolContextType = {
  displayStoryUpload: true,
  storyText: '',
  setDisplayStoryUpload: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
  setStoryText: () => {
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

  const value = {
    displayStoryUpload,
    storyText,
    setDisplayStoryUpload,
    setStoryText,
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

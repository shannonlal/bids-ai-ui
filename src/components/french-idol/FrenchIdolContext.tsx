import { createContext, useContext, ReactNode, useState } from 'react';

type InputMethod = 'upload' | 'text' | null;

interface FrenchIdolContextType {
  displayStoryUpload: boolean;
  storyText: string;
  inputMethod: InputMethod;
  setDisplayStoryUpload: (display: boolean) => void;
  setStoryText: (text: string) => void;
  setInputMethod: (method: InputMethod) => void;
}

const defaultContext: FrenchIdolContextType = {
  displayStoryUpload: true,
  storyText: '',
  inputMethod: null,
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

  const value = {
    displayStoryUpload,
    storyText,
    inputMethod,
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

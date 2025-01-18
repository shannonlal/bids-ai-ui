import { createContext, useContext, ReactNode, useState } from 'react';

interface FrenchIdolContextType {
  displayStoryUpload: boolean;
  setDisplayStoryUpload: (display: boolean) => void;
}

const defaultContext: FrenchIdolContextType = {
  displayStoryUpload: true,
  setDisplayStoryUpload: () => {
    throw new Error('FrenchIdolContext not initialized');
  },
};

const FrenchIdolContext = createContext<FrenchIdolContextType>(defaultContext);

interface FrenchIdolProviderProps {
  children: ReactNode;
}

export function FrenchIdolProvider({ children }: FrenchIdolProviderProps) {
  const [displayStoryUpload, setDisplayStoryUpload] = useState(true);

  const value = {
    displayStoryUpload,
    setDisplayStoryUpload,
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

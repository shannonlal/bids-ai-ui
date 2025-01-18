import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const value = {
    currentQuestion,
    score,
    setCurrentQuestion,
    setScore,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

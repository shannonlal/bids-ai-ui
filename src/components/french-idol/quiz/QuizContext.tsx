import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  storyText: string;
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setStoryText: (text: string) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
  initialStoryText?: string;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children, initialStoryText = '' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [storyText, setStoryText] = useState(initialStoryText);

  const value = {
    currentQuestion,
    score,
    storyText,
    setCurrentQuestion,
    setScore,
    setStoryText,
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

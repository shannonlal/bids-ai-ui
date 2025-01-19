import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  storyText: string;
  questions: string[];
  answeredQuestions: number[];
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setStoryText: (text: string) => void;
  setQuestions: (questions: string[]) => void;
  markQuestionAnswered: (questionIndex: number, grade: number) => void;
  hasMoreQuestions: () => boolean;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
  initialStoryText?: string;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children, initialStoryText = '' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [storyText, setStoryText] = useState(initialStoryText);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const markQuestionAnswered = (questionIndex: number, grade: number) => {
    setAnsweredQuestions(prev => [...prev, questionIndex]);
    setScore(prev => prev + grade);
    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  const hasMoreQuestions = () => {
    return currentQuestion < questions.length;
  };

  const value = {
    currentQuestion,
    score,
    storyText,
    questions,
    answeredQuestions,
    setCurrentQuestion,
    setScore,
    setStoryText,
    setQuestions,
    markQuestionAnswered,
    hasMoreQuestions,
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

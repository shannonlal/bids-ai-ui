import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { determineQuestions } from '../../../hooks/useDetermineQuestions';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  storyText: string;
  questions: string[];
  answeredQuestions: number[];
  questionScores: number[];
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setStoryText: (text: string) => void;
  setQuestions: (questions: string[]) => void;
  markQuestionAnswered: (questionIndex: number, grade: number) => void;
  hasMoreQuestions: () => boolean;
  resetQuiz: () => void;
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
  const [questionScores, setQuestionScores] = useState<number[]>([]);

  // Reset quiz state when starting a new quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuestionScores([]);
  };

  // Effect to handle story text updates
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        if (storyText.trim()) {
          const newQuestions = await determineQuestions(storyText);
          setQuestions(newQuestions);
          resetQuiz();
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions([]);
      }
    };

    loadQuestions();
  }, [storyText]);

  const markQuestionAnswered = (questionIndex: number, grade: number) => {
    setAnsweredQuestions(prev => {
      if (prev.includes(questionIndex)) {
        return prev; // Prevent answering the same question multiple times
      }
      return [...prev, questionIndex];
    });
    setScore(prev => prev + grade);
    setQuestionScores(prev => {
      const newScores = [...prev];
      newScores[questionIndex] = grade;
      return newScores;
    });

    // Move to next question if available
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
    questionScores,
    setCurrentQuestion,
    setScore,
    setStoryText,
    setQuestions,
    markQuestionAnswered,
    hasMoreQuestions,
    resetQuiz,
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

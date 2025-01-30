import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { determineQuestions } from '../../../hooks/useDetermineQuestions';

interface QuizContextType {
  currentQuestion: number;
  score: number;
  storyText: string;
  questions: string[];
  answeredQuestions: number[];
  questionScores: number[];
  questionResponses: string[];
  questionCorrections: string[];
  userEmail: string;
  storyId: string;
  isCompleted: boolean;
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setStoryText: (text: string) => void;
  setQuestions: (questions: string[]) => void;
  setUserEmail: (email: string) => void;
  setStoryId: (id: string) => void;
  markQuestionAnswered: (
    questionIndex: number,
    grade: number,
    response: string,
    correction: string
  ) => void;
  hasMoreQuestions: () => boolean;
  resetQuiz: () => void;
}

export const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
  initialStoryText?: string;
  initialUserEmail?: string;
  initialStoryId?: string;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({
  children,
  initialStoryText = '',
  initialUserEmail = '',
  initialStoryId = '',
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [storyText, setStoryText] = useState(initialStoryText);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [questionScores, setQuestionScores] = useState<number[]>([]);
  const [questionResponses, setQuestionResponses] = useState<string[]>([]);
  const [questionCorrections, setQuestionCorrections] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const [storyId, setStoryId] = useState(initialStoryId);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset quiz state when starting a new quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuestionScores([]);
    setQuestionResponses([]);
    setQuestionCorrections([]);
    setIsCompleted(false);
  };

  const markStoryComplete = async () => {
    if (userEmail && storyId && !isCompleted) {
      try {
        await fetch('/api/stories/markRead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            storyId: storyId,
            quizScore: score,
            totalQuestions: questions.length,
            questions,
            questionResponses,
            questionCorrections,
          }),
        });
      } catch (error) {
        console.error('Error marking story as read:', error);
      }
    }
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

  const markQuestionAnswered = (
    questionIndex: number,
    grade: number,
    response: string,
    correction: string
  ) => {
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
    setQuestionResponses(prev => {
      const newResponses = [...prev];
      newResponses[questionIndex] = response;
      return newResponses;
    });
    setQuestionCorrections(prev => {
      const newCorrections = [...prev];
      newCorrections[questionIndex] = correction;
      return newCorrections;
    });

    // Check if this was the last question
    const newAnsweredCount = answeredQuestions.length + 1;
    if (newAnsweredCount === questions.length) {
      setIsCompleted(true);
      markStoryComplete();
    }

    // Move to next question if available
    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  const hasMoreQuestions = () => {
    return currentQuestion < questions.length && answeredQuestions.length < questions.length;
  };

  const value = {
    currentQuestion,
    score,
    storyText,
    questions,
    answeredQuestions,
    questionScores,
    questionResponses,
    questionCorrections,
    userEmail,
    storyId,
    isCompleted,
    setCurrentQuestion,
    setScore,
    setStoryText,
    setQuestions,
    setUserEmail,
    setStoryId,
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

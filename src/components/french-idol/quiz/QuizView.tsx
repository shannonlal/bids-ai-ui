import React from 'react';
import { useQuiz } from './QuizContext';

export const QuizView: React.FC = () => {
  const { currentQuestion, score } = useQuiz();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">French Idol Quiz</h1>
        <p className="text-gray-600 mb-4">
          Welcome to the French Idol Quiz! Test your knowledge and improve your French language
          skills.
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Question {currentQuestion + 1}</span>
          <span>Score: {score}</span>
        </div>
      </div>
    </div>
  );
};

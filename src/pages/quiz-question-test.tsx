import React from 'react';
import { QuizQuestion } from '../components/french-idol/quiz/QuizQuestion';

export default function QuizQuestionTest() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <QuizQuestion question="What is the capital of France?" />
      </div>
    </div>
  );
}

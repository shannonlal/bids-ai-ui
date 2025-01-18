import React, { useState } from 'react';
import { QuizQuestion } from '../components/french-idol/quiz/QuizQuestion';

export default function QuizQuestionTest() {
  const [error, setError] = useState<string>();
  const [grade, setGrade] = useState<number>();

  const handleSubmit = (answer: string) => {
    const isCorrect = answer.toLowerCase() === 'paris';
    setError(isCorrect ? undefined : 'Incorrect answer');
    setGrade(isCorrect ? 5 : 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <QuizQuestion
          question="What is the capital of France?"
          onSubmit={handleSubmit}
          error={error}
          grade={grade}
        />
      </div>
    </div>
  );
}

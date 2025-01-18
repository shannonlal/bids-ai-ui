import React, { useState } from 'react';
import { TextInput } from '../../../ui-kit/TextInput';
import { Button } from '../../../ui-kit/Button';

interface QuizQuestionProps {
  question: string;
  onSubmit: (answer: string) => void;
  error?: string;
  grade?: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onSubmit, error, grade }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">{question}</h2>
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <TextInput
            value={answer}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your answer..."
            error={!!error}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        {grade !== undefined && (
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-600">{grade}/5</span>
          </div>
        )}
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

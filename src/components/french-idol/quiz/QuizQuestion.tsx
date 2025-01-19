import React, { useState } from 'react';
import { TextInput } from '../../../ui-kit/TextInput';
import { Button } from '../../../ui-kit/Button';
import { useValidResponse } from '../../../hooks/useValidResponse';

interface QuizQuestionProps {
  question: string;
  questionIndex: number;
  onAnswered: (index: number, grade: number) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  onAnswered,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string>();
  const [grade, setGrade] = useState<number>();
  const { validateResponse, isValidating } = useValidResponse();

  const handleSubmit = async () => {
    if (answer.trim()) {
      const result = await validateResponse(question, answer);
      setError(result.errorMessage);
      const questionGrade = result.grade || 0;
      setGrade(questionGrade);
      setAnswer('');
      onAnswered(questionIndex, questionGrade);
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
      <Button onClick={handleSubmit} disabled={isValidating}>
        {isValidating ? 'Validating...' : 'Submit'}
      </Button>
    </div>
  );
};

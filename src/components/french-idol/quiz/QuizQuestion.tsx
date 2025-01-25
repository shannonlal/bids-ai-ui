import React, { useState, useEffect } from 'react';
import { TextInput } from '../../../ui-kit/TextInput';
import { Button } from '../../../ui-kit/Button';
import { useValidResponse } from '../../../hooks/useValidResponse';
import { useQuiz } from './QuizContext';

interface QuizQuestionProps {
  question: string;
  questionIndex: number;
  onAnswered: (index: number, grade: number, response: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  onAnswered,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string>('');
  const [grade, setGrade] = useState<number | null>(null);

  // Reset states when question changes
  useEffect(() => {
    setError('');
    setGrade(null);
    setAnswer('');
  }, [question]);
  const { validateResponse, isValidating } = useValidResponse();
  const { storyText } = useQuiz();

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }

    try {
      setError('');
      const result = await validateResponse(question, answer, storyText);
      if (result.errorMessage) {
        setError(result.errorMessage);
        return;
      }

      const questionGrade = result.grade || 0;
      setGrade(questionGrade);
      onAnswered(questionIndex, questionGrade, answer);
      setAnswer('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while validating your answer'
      );
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
        <div className="flex items-center">
          <span className="text-lg font-medium text-gray-600">
            {grade !== null ? `${grade}/5` : '/5'}
          </span>
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={isValidating}>
        {isValidating ? 'Validating...' : 'Submit'}
      </Button>
    </div>
  );
};

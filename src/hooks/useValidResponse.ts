import { useState, useCallback } from 'react';

export interface ValidationResult {
  grade: number;
  errorMessage?: string;
}

export const useValidResponse = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateResponse = useCallback(
    async (_question: string, _userInput: string): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate random number between 0 and 5
        const randomGrade = Math.floor(Math.random() * 6);

        const result: ValidationResult = {
          grade: randomGrade,
          ...(randomGrade < 5 && { errorMessage: 'Your response needs improvement' }),
        };

        return result;
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  return {
    validateResponse,
    isValidating,
  };
};

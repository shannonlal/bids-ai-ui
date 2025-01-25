import { useState, useCallback } from 'react';
import { ValidateResponseApiResponse } from '../types/api/validateResponse';

export interface ValidationResult {
  grade: number;
  errorMessage?: string;
}

export const useValidResponse = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateResponse = useCallback(
    async (question: string, userInput: string, story: string): Promise<ValidationResult> => {
      setIsValidating(true);
      try {
        const response = await fetch('/api/validateResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            story,
            question,
            response: userInput,
          }),
        });

        const data: ValidateResponseApiResponse = await response.json();

        if ('error' in data && data.error) {
          throw new Error(data.error.message);
        }

        return {
          grade: data.score,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to validate response';
        return {
          grade: 0,
          errorMessage,
        };
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

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { QuizProvider, useQuiz } from './QuizContext';

describe('QuizContext', () => {
  it('provides quiz context values', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuizProvider>{children}</QuizProvider>
    );

    const { result } = renderHook(() => useQuiz(), { wrapper });

    expect(result.current.currentQuestion).toBe(0);
    expect(result.current.score).toBe(0);

    act(() => {
      result.current.setCurrentQuestion(1);
      result.current.setScore(5);
    });

    expect(result.current.currentQuestion).toBe(1);
    expect(result.current.score).toBe(5);
  });

  it('throws error when useQuiz is used outside of QuizProvider', () => {
    expect(() => renderHook(() => useQuiz())).toThrow('useQuiz must be used within a QuizProvider');
  });
});

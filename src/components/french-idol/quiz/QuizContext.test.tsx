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
    expect(result.current.questionScores).toEqual([]);

    act(() => {
      result.current.setCurrentQuestion(1);
      result.current.setScore(5);
    });

    expect(result.current.currentQuestion).toBe(1);
    expect(result.current.score).toBe(5);
  });

  it('tracks individual question scores when marking questions as answered', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuizProvider>{children}</QuizProvider>
    );

    const { result } = renderHook(() => useQuiz(), { wrapper });

    act(() => {
      result.current.setQuestions(['Q1', 'Q2', 'Q3']);
      result.current.markQuestionAnswered(0, 3); // Q1 score: 3
      result.current.markQuestionAnswered(1, 5); // Q2 score: 5
    });

    expect(result.current.questionScores).toEqual([3, 5]);
    expect(result.current.score).toBe(8); // Total score should be sum of individual scores
    expect(result.current.answeredQuestions).toEqual([0, 1]);
  });

  it('resets question scores when quiz is reset', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuizProvider>{children}</QuizProvider>
    );

    const { result } = renderHook(() => useQuiz(), { wrapper });

    act(() => {
      result.current.setQuestions(['Q1', 'Q2']);
      result.current.markQuestionAnswered(0, 4);
      result.current.resetQuiz();
    });

    expect(result.current.questionScores).toEqual([]);
    expect(result.current.score).toBe(0);
    expect(result.current.currentQuestion).toBe(0);
    expect(result.current.answeredQuestions).toEqual([]);
  });

  it('throws error when useQuiz is used outside of QuizProvider', () => {
    expect(() => renderHook(() => useQuiz())).toThrow('useQuiz must be used within a QuizProvider');
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuizView } from './QuizView';
import { FrenchIdolContext } from '../FrenchIdolContext';
import { QuizContext } from './QuizContext';
import { describe, it, expect, vi } from 'vitest';

const mockQuizContext = {
  currentQuestion: 0,
  score: 0,
  storyText: 'test story',
  questions: [],
  answeredQuestions: [],
  questionScores: [],
  questionResponses: [],
  questionCorrections: [],
  setCurrentQuestion: () => {},
  setScore: () => {},
  setStoryText: () => {},
  setQuestions: () => {},
  markQuestionAnswered: () => {},
  hasMoreQuestions: () => false,
  resetQuiz: () => {},
};

describe('QuizView', () => {
  it('renders loading state when isLoading is true', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: false,
          storyText: 'test story',
          inputMethod: null,
          currentUser: null,
          isLoading: true,
          error: null,
          stories: [],
          setDisplayStoryUpload: vi.fn(),
          setStoryText: vi.fn(),
          setInputMethod: vi.fn(),
        }}
      >
        <QuizContext.Provider value={mockQuizContext}>
          <QuizView />
        </QuizContext.Provider>
      </FrenchIdolContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state when error exists', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: false,
          storyText: 'test story',
          inputMethod: null,
          currentUser: null,
          isLoading: false,
          error: 'Test error',
          stories: [],
          setDisplayStoryUpload: vi.fn(),
          setStoryText: vi.fn(),
          setInputMethod: vi.fn(),
        }}
      >
        <QuizContext.Provider value={mockQuizContext}>
          <QuizView />
        </QuizContext.Provider>
      </FrenchIdolContext.Provider>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});

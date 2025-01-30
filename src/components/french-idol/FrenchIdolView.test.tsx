import React from 'react';
import { render, screen } from '@testing-library/react';
import { FrenchIdolView } from './FrenchIdolView';
import { FrenchIdolContext } from './FrenchIdolContext';
import { QuizContext } from './quiz/QuizContext';
import { describe, it, expect } from 'vitest';

const mockQuizContext = {
  currentQuestion: 0,
  score: 0,
  storyText: 'test story',
  questions: [],
  answeredQuestions: [],
  questionScores: [],
  questionResponses: [],
  questionCorrections: [],
  userEmail: 'test@example.com',
  storyId: 'story-123',
  setCurrentQuestion: () => {},
  setScore: () => {},
  setStoryText: () => {},
  setQuestions: () => {},
  setUserEmail: () => {},
  setStoryId: () => {},
  markQuestionAnswered: () => {},
  hasMoreQuestions: () => false,
  resetQuiz: () => {},
};

describe('FrenchIdolView', () => {
  it('renders upload and paste sections when displayStoryUpload is true', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: true,
          storyText: '',
          inputMethod: null,
          currentUser: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            createdAt: '2024-01-29T12:00:00.000Z',
            updatedAt: '2024-01-29T12:00:00.000Z',
          },
          isLoading: false,
          error: null,
          stories: [],
          setDisplayStoryUpload: () => {},
          setStoryText: () => {},
          setInputMethod: () => {},
        }}
      >
        <FrenchIdolView />
      </FrenchIdolContext.Provider>
    );

    expect(screen.getByText('Upload PDF')).toBeInTheDocument();
    expect(screen.getByText('Paste Text')).toBeInTheDocument();
  });

  it('renders quiz when displayStoryUpload is false', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: false,
          storyText: 'test story',
          inputMethod: null,
          currentUser: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            createdAt: '2024-01-29T12:00:00.000Z',
            updatedAt: '2024-01-29T12:00:00.000Z',
          },
          isLoading: false,
          error: null,
          stories: [],
          setDisplayStoryUpload: () => {},
          setStoryText: () => {},
          setInputMethod: () => {},
        }}
      >
        <QuizContext.Provider value={mockQuizContext}>
          <FrenchIdolView />
        </QuizContext.Provider>
      </FrenchIdolContext.Provider>
    );

    expect(screen.queryByText('Upload PDF')).not.toBeInTheDocument();
    expect(screen.queryByText('Paste Text')).not.toBeInTheDocument();
  });
});

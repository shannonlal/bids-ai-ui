import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QuizView } from './QuizView';
import { QuizProvider, QuizContext } from './QuizContext';
import { FrenchIdolContext } from '../FrenchIdolContext';
vi.mock('../../../hooks/useDetermineQuestions', () => ({
  determineQuestions: vi.fn().mockResolvedValue(['Test question']),
}));

describe('QuizView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderQuizView = (setDisplayStoryUpload = vi.fn()) => {
    return render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: false,
          storyText: 'Test story',
          setDisplayStoryUpload,
          setStoryText: vi.fn(),
        }}
      >
        <QuizProvider initialStoryText="Test story">
          <QuizContext.Consumer>
            {value => {
              if (!value) return null;
              // Set up initial quiz state
              setTimeout(() => {
                value.setQuestions(['Test question']);
              }, 0);
              return <QuizView />;
            }}
          </QuizContext.Consumer>
        </QuizProvider>
      </FrenchIdolContext.Provider>
    );
  };

  const renderCompletedQuiz = async (setDisplayStoryUpload = vi.fn()) => {
    return render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: false,
          storyText: 'Test story',
          setDisplayStoryUpload,
          setStoryText: vi.fn(),
        }}
      >
        <QuizProvider initialStoryText="Test story">
          <QuizContext.Consumer>
            {value => {
              if (!value) return null;
              // Set up completed quiz state in next tick to avoid React state updates warning
              setTimeout(() => {
                value.setQuestions(['Test question']);
                value.setCurrentQuestion(1); // Past the last question
                value.setScore(5);
              }, 0);
              return <QuizView />;
            }}
          </QuizContext.Consumer>
        </QuizProvider>
      </FrenchIdolContext.Provider>
    );
  };

  it('renders quiz view with initial state', async () => {
    renderQuizView();

    expect(screen.getByText('French Idol Quiz')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Question 1 of 1')).toBeInTheDocument();
    });
    expect(screen.getByText('(0 answered)')).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Welcome to the French Idol Quiz! Test your knowledge and improve your French language skills.'
      )
    ).toBeInTheDocument();
  });

  it('clicking Start Again button sets displayStoryUpload to true', async () => {
    const setDisplayStoryUpload = vi.fn();
    renderCompletedQuiz(setDisplayStoryUpload);
    const startAgainButton = await waitFor(() => screen.getByText('Start Again'));
    await userEvent.click(startAgainButton);
    expect(setDisplayStoryUpload).toHaveBeenCalledWith(true);
  });

  it('renders QuizStory component', async () => {
    renderQuizView();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your story here...')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FrenchIdolView } from './FrenchIdolView';
import { FrenchIdolContext } from './FrenchIdolContext';
import { QuizProvider } from './quiz/QuizContext';
vi.mock('../../hooks/useDetermineQuestions', () => ({
  determineQuestions: vi.fn().mockResolvedValue(['Test question']),
}));

describe('FrenchIdolView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (displayStoryUpload: boolean) => {
    const mockContextValue = {
      displayStoryUpload,
      storyText: 'Test story',
      setDisplayStoryUpload: () => {},
      setStoryText: () => {},
    };

    return render(
      <FrenchIdolContext.Provider value={mockContextValue}>
        <QuizProvider initialStoryText="Test story">
          <FrenchIdolView />
        </QuizProvider>
      </FrenchIdolContext.Provider>
    );
  };

  it('renders the view with title', () => {
    renderWithProvider(true);
    expect(screen.getByText('French Idol Practice')).toBeInTheDocument();
  });

  it('renders the StoryUpload component when displayStoryUpload is true', () => {
    renderWithProvider(true);
    expect(screen.getByText('Upload your French PDF story')).toBeInTheDocument();
  });

  it('renders QuizView when displayStoryUpload is false', async () => {
    renderWithProvider(false);
    expect(screen.getByText('French Idol Quiz')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
    });
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });
});

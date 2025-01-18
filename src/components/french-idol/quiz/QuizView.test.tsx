import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QuizView } from './QuizView';
import { QuizProvider } from './QuizContext';
import { FrenchIdolContext } from '../FrenchIdolContext';

describe('QuizView', () => {
  const renderQuizView = (setDisplayStoryUpload = vi.fn()) => {
    return render(
      <FrenchIdolContext.Provider value={{ displayStoryUpload: false, setDisplayStoryUpload }}>
        <QuizProvider>
          <QuizView />
        </QuizProvider>
      </FrenchIdolContext.Provider>
    );
  };

  it('renders quiz view with initial state', () => {
    renderQuizView();

    expect(screen.getByText('French Idol Quiz')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Welcome to the French Idol Quiz! Test your knowledge and improve your French language skills.'
      )
    ).toBeInTheDocument();
  });

  it('clicking Start Again button sets displayStoryUpload to true', async () => {
    const setDisplayStoryUpload = vi.fn();
    renderQuizView(setDisplayStoryUpload);
    const startAgainButton = screen.getByText('Start Again');
    await userEvent.click(startAgainButton);
    expect(setDisplayStoryUpload).toHaveBeenCalledWith(true);
  });
});

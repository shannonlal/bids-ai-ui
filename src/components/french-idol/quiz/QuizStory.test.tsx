import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizStory } from './QuizStory';
import { QuizProvider, useQuiz } from './QuizContext';
import * as determineQuestionsModule from '../../../hooks/useDetermineQuestions';

vi.mock('../../../hooks/useDetermineQuestions', () => ({
  useDetermineQuestions: vi
    .fn()
    .mockImplementation(async () => ['Test question 1', 'Test question 2']),
}));

describe('QuizStory', () => {
  const mockQuestions = ['Test question 1', 'Test question 2'];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(determineQuestionsModule.useDetermineQuestions).mockResolvedValue([
      'Test question 1',
      'Test question 2',
    ]);
  });

  it('renders textarea', () => {
    render(
      <QuizProvider>
        <QuizStory />
      </QuizProvider>
    );

    const textarea = screen.getByPlaceholderText('Enter your story here...');
    expect(textarea).toBeInTheDocument();
  });

  it('updates story text on input', async () => {
    render(
      <QuizProvider>
        <QuizStory />
      </QuizProvider>
    );

    const textarea = screen.getByPlaceholderText('Enter your story here...');
    fireEvent.change(textarea, { target: { value: 'Test story' } });
    expect(textarea).toHaveValue('Test story');
    await waitFor(() => {
      expect(determineQuestionsModule.useDetermineQuestions).toHaveBeenCalledWith('Test story');
    });
  });

  it('sets questions in context when story text changes', async () => {
    const TestComponent = () => {
      const { questions } = useQuiz();
      return <div data-testid="questions">{JSON.stringify(questions)}</div>;
    };

    render(
      <QuizProvider>
        <TestComponent />
        <QuizStory />
      </QuizProvider>
    );

    const textarea = screen.getByPlaceholderText('Enter your story here...');
    fireEvent.change(textarea, { target: { value: 'Test story' } });

    await waitFor(
      () => {
        expect(determineQuestionsModule.useDetermineQuestions).toHaveBeenCalledWith('Test story');
        const questionsElement = screen.getByTestId('questions');
        expect(questionsElement.textContent).toBe(JSON.stringify(mockQuestions));
      },
      { timeout: 1000 }
    );
  });
});

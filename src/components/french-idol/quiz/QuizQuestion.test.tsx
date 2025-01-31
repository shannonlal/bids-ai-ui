import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this to extend expect matchers
import { QuizQuestion } from './QuizQuestion';
import * as useValidResponseModule from '../../../hooks/useValidResponse';
import { QuizContext } from './QuizContext';
import { FrenchIdolProvider } from '../FrenchIdolContext';

vi.mock('../../../hooks/useValidResponse', () => ({
  useValidResponse: vi.fn(),
}));

const mockQuizContext = {
  storyText: 'Test story content',
  currentQuestion: 0,
  score: 0,
  questions: ['Test question'],
  answeredQuestions: [],
  questionScores: [],
  questionResponses: [],
  questionCorrections: [],
  questionSuggestedAnswers: [],
  userEmail: 'test@example.com',
  storyId: 'story-123',
  isCompleted: false,
  setCurrentQuestion: vi.fn(),
  setScore: vi.fn(),
  setStoryText: vi.fn(),
  setQuestions: vi.fn(),
  setUserEmail: vi.fn(),
  setStoryId: vi.fn(),
  markQuestionAnswered: vi.fn(),
  hasMoreQuestions: vi.fn(),
  resetQuiz: vi.fn(),
};

const mockFrenchIdolContext = {
  displayStoryUpload: false,
  setDisplayStoryUpload: vi.fn(),
  storyText: '',
  setStoryText: vi.fn(),
  inputMethod: null,
  setInputMethod: vi.fn(),
  currentUser: null,
  isLoading: false,
  error: null,
  stories: [],
};

vi.mock('../FrenchIdolContext', () => ({
  useFrenchIdol: () => mockFrenchIdolContext,
  FrenchIdolProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithQuizContext = (ui: React.ReactElement) => {
  return render(
    <FrenchIdolProvider>
      <QuizContext.Provider value={mockQuizContext}>{ui}</QuizContext.Provider>
    </FrenchIdolProvider>
  );
};

describe('QuizQuestion', () => {
  const mockValidateResponse = vi.fn();
  const mockOnAnswered = vi.fn();
  const defaultProps = {
    question: 'What is the capital of France?',
    questionIndex: 0,
    onAnswered: mockOnAnswered,
  };

  beforeEach(() => {
    mockValidateResponse.mockClear();
    mockOnAnswered.mockClear();
    vi.mocked(useValidResponseModule.useValidResponse).mockReturnValue({
      validateResponse: mockValidateResponse,
      isValidating: false,
    });
  });

  it('renders the question', () => {
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    expect(screen.getByText(defaultProps.question)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Paris' } });
    expect(input.value).toBe('Paris');
  });

  it('validates answer and shows result when submit button is clicked', async () => {
    mockValidateResponse.mockResolvedValueOnce({
      grade: 5,
      correction: 'Excellent! Votre réponse est parfaite.',
      suggestedAnswer: 'La capitale de la France est Paris.',
    });
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...') as HTMLInputElement;
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(submitButton);

    expect(mockValidateResponse).toHaveBeenCalledWith(
      defaultProps.question,
      'Paris',
      mockQuizContext.storyText,
      mockQuizContext.userEmail,
      mockQuizContext.storyId
    );
    await waitFor(() => {
      expect(mockOnAnswered).toHaveBeenCalledWith(
        0,
        5,
        'Paris',
        'Excellent! Votre réponse est parfaite.',
        'La capitale de la France est Paris.'
      );
    });
    await waitFor(() => {
      const gradeText = screen.getByText('5/5');
      expect(gradeText).toBeInTheDocument();
      expect(input.value).toBe('');
    });
  });

  it('shows loading state during validation', async () => {
    vi.mocked(useValidResponseModule.useValidResponse).mockReturnValue({
      validateResponse: mockValidateResponse,
      isValidating: true,
    });
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const submitButton = screen.getByText('Validating...');
    expect(submitButton).toBeDisabled();
  });

  it('does not submit empty answers', async () => {
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('Submit');
    // Try submitting with empty input
    fireEvent.click(submitButton);
    expect(mockValidateResponse).not.toHaveBeenCalled();
    // Try submitting with whitespace
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(submitButton);
    expect(mockValidateResponse).not.toHaveBeenCalled();
  });

  it('navigates back when back button is clicked', () => {
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    expect(mockFrenchIdolContext.setDisplayStoryUpload).toHaveBeenCalledWith(true);
  });
});

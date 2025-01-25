import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';
import * as useValidResponseModule from '../../../hooks/useValidResponse';
import { QuizContext } from './QuizContext';

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
  setCurrentQuestion: vi.fn(),
  setScore: vi.fn(),
  setStoryText: vi.fn(),
  setQuestions: vi.fn(),
  markQuestionAnswered: vi.fn(),
  hasMoreQuestions: vi.fn(),
  resetQuiz: vi.fn(),
};

const renderWithQuizContext = (ui: React.ReactElement) => {
  return render(<QuizContext.Provider value={mockQuizContext}>{ui}</QuizContext.Provider>);
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
    const input = screen.getByPlaceholderText('Enter your answer...');
    fireEvent.change(input, { target: { value: 'Paris' } });
    expect(input).toHaveValue('Paris');
  });

  it('validates answer and shows result when submit button is clicked', async () => {
    mockValidateResponse.mockResolvedValueOnce({ grade: 5 });
    renderWithQuizContext(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(submitButton);

    expect(mockValidateResponse).toHaveBeenCalledWith(
      defaultProps.question,
      'Paris',
      mockQuizContext.storyText
    );
    await waitFor(() => {
      expect(mockOnAnswered).toHaveBeenCalledWith(0, 5);
    });
    await waitFor(() => {
      const gradeText = screen.getByText('5/5');
      expect(gradeText).toBeInTheDocument();
      expect(input).toHaveValue('');
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
});

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';
import * as useValidResponseModule from '../../../hooks/useValidResponse';

vi.mock('../../../hooks/useValidResponse', () => ({
  useValidResponse: vi.fn(),
}));

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
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.getByText(defaultProps.question)).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    fireEvent.change(input, { target: { value: 'Paris' } });
    expect(input).toHaveValue('Paris');
  });

  it('validates answer and shows result when submit button is clicked', async () => {
    mockValidateResponse.mockResolvedValueOnce({ grade: 5 });
    render(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(submitButton);

    expect(mockValidateResponse).toHaveBeenCalledWith(defaultProps.question, 'Paris');
    await waitFor(() => {
      expect(screen.getByText('5/5')).toBeInTheDocument();
      expect(input).toHaveValue('');
      expect(mockOnAnswered).toHaveBeenCalledWith(0, 5);
    });
  });

  it('submits when Enter key is pressed', async () => {
    mockValidateResponse.mockResolvedValueOnce({ grade: 4, errorMessage: 'Close, but not quite' });
    render(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockValidateResponse).toHaveBeenCalledWith(defaultProps.question, 'Paris');
    await waitFor(() => {
      expect(screen.getByText('4/5')).toBeInTheDocument();
      expect(screen.getByText('Close, but not quite')).toBeInTheDocument();
      expect(input).toHaveValue('');
      expect(mockOnAnswered).toHaveBeenCalledWith(0, 4);
    });
  });

  it('shows loading state during validation', async () => {
    vi.mocked(useValidResponseModule.useValidResponse).mockReturnValue({
      validateResponse: mockValidateResponse,
      isValidating: true,
    });
    render(<QuizQuestion {...defaultProps} />);
    const submitButton = screen.getByText('Validating...');
    expect(submitButton).toBeDisabled();
  });

  it('does not submit empty answers', async () => {
    render(<QuizQuestion {...defaultProps} />);
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

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';

describe('QuizQuestion', () => {
  const defaultProps = {
    question: 'What is the capital of France?',
    onSubmit: vi.fn(),
  };

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

  it('calls onSubmit with input value and clears input when submit button is clicked', () => {
    render(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith('Paris');
    expect(input).toHaveValue('');
  });

  it('submits when Enter key is pressed', () => {
    render(<QuizQuestion {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter your answer...');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(defaultProps.onSubmit).toHaveBeenCalledWith('Paris');
    expect(input).toHaveValue('');
  });

  it('displays error message when provided', () => {
    const error = 'Incorrect answer';
    render(<QuizQuestion {...defaultProps} error={error} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('displays grade when provided', () => {
    const grade = 4;
    render(<QuizQuestion {...defaultProps} grade={grade} />);
    expect(screen.getByText('4/5')).toBeInTheDocument();
  });

  it('does not display grade when not provided', () => {
    render(<QuizQuestion {...defaultProps} />);
    expect(screen.queryByText('/5')).not.toBeInTheDocument();
  });
});

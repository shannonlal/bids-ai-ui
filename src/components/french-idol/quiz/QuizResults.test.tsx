import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizResults } from './QuizResults';

describe('QuizResults', () => {
  const mockResults = [
    { question: 'What is the capital of France?', score: 5 },
    { question: 'What is the capital of Spain?', score: 4 },
    { question: 'What is the capital of Italy?', score: 3 },
  ];

  const defaultProps = {
    results: mockResults,
  };

  it('renders the quiz results title', () => {
    render(<QuizResults {...defaultProps} />);
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
  });

  it('renders all questions and scores', () => {
    render(<QuizResults {...defaultProps} />);
    mockResults.forEach(result => {
      expect(screen.getByText(result.question)).toBeInTheDocument();
      expect(screen.getByText(`${result.score}/5`)).toBeInTheDocument();
    });
  });

  it('calculates and displays total score correctly', () => {
    render(<QuizResults {...defaultProps} />);
    const totalScore = mockResults.reduce((sum, result) => sum + result.score, 0);
    const maxScore = mockResults.length * 5;
    expect(screen.getByText(`${totalScore}/${maxScore}`)).toBeInTheDocument();
  });

  it('renders empty results gracefully', () => {
    render(<QuizResults results={[]} />);
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<QuizResults {...defaultProps} />);
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });
});

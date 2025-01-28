import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizResults } from './QuizResults';

describe('QuizResults', () => {
  const mockResults = [
    {
      question: 'What is the capital of France?',
      score: 5,
      response: 'Paris',
      correction: 'Excellent! Votre réponse est parfaite.',
    },
    {
      question: 'What is the capital of Spain?',
      score: 4,
      response: 'Madrid',
      correction: 'Très bien! Votre réponse est correcte.',
    },
    {
      question: 'What is the capital of Italy?',
      score: 3,
      response: 'Rome',
      correction: 'Bien! Mais il faut faire attention aux accents.',
    },
  ];

  const defaultProps = {
    results: mockResults,
  };

  it('renders the quiz results title', () => {
    render(<QuizResults {...defaultProps} />);
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
  });

  it('renders all questions, responses, and scores', () => {
    render(<QuizResults {...defaultProps} />);
    mockResults.forEach(result => {
      expect(screen.getByText(result.question)).toBeInTheDocument();
      expect(screen.getByText(result.response)).toBeInTheDocument();
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
    expect(screen.getByText('Response')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('renders feedback for each question', () => {
    render(<QuizResults {...defaultProps} />);
    mockResults.forEach(result => {
      expect(screen.getByText(result.correction)).toBeInTheDocument();
    });
  });
});

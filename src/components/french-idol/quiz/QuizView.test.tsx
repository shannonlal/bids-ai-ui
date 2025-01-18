import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QuizView } from './QuizView';
import { QuizProvider } from './QuizContext';

describe('QuizView', () => {
  it('renders quiz view with initial state', () => {
    render(
      <QuizProvider>
        <QuizView />
      </QuizProvider>
    );

    expect(screen.getByText('French Idol Quiz')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Welcome to the French Idol Quiz! Test your knowledge and improve your French language skills.'
      )
    ).toBeInTheDocument();
  });
});

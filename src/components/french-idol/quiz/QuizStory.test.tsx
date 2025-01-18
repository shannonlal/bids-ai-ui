import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizStory } from './QuizStory';
import { QuizProvider } from './QuizContext';

describe('QuizStory', () => {
  it('renders textarea', () => {
    render(
      <QuizProvider>
        <QuizStory />
      </QuizProvider>
    );

    const textarea = screen.getByPlaceholderText('Enter your story here...');
    expect(textarea).toBeInTheDocument();
  });

  it('updates story text on input', () => {
    render(
      <QuizProvider>
        <QuizStory />
      </QuizProvider>
    );

    const textarea = screen.getByPlaceholderText('Enter your story here...');
    fireEvent.change(textarea, { target: { value: 'Test story' } });
    expect(textarea).toHaveValue('Test story');
  });
});

/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsComponent } from './ResultsComponent';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ResultsComponent', () => {
  const mockStories = [
    {
      id: '1',
      title: 'Test Story 1',
      userEmail: 'test@example.com',
      sourceText: 'source',
      article: 'article',
      read: true,
      quizScore: 8,
      totalQuestions: 10,
      questions: ['Q1', 'Q2'],
      questionResponses: ['A1', 'A2'],
      questionCorrections: ['C1', 'C2'],
      createdAt: '2024-01-30T12:00:00Z',
      updatedAt: '2024-01-30T13:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ stories: mockStories }),
      })
    );
  });

  it('renders loading state initially', () => {
    render(<ResultsComponent email="test@example.com" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders stories after loading', async () => {
    render(<ResultsComponent email="test@example.com" />);

    // Wait for loading to complete
    expect(await screen.findByText('Test Story 1')).toBeInTheDocument();
    const scoreElement = screen.getByTestId('story-score');
    expect(scoreElement).toHaveTextContent('8 / 10');
    expect(scoreElement).toHaveTextContent('80%');
  });

  it('shows "No completed stories" message when no stories exist', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ stories: [] }),
      })
    );
    render(<ResultsComponent email="test@example.com" />);

    expect(await screen.findByText('No completed stories found')).toBeInTheDocument();
  });

  it('opens quiz results modal when clicking view results', async () => {
    render(<ResultsComponent email="test@example.com" />);

    // Wait for the button to appear and click it
    const viewButton = await screen.findByText('View Results');
    fireEvent.click(viewButton);

    // Check if modal content is displayed
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Story 1');
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  it('closes quiz results modal when clicking close button', async () => {
    render(<ResultsComponent email="test@example.com" />);

    // Open modal
    const viewButton = await screen.findByText('View Results');
    fireEvent.click(viewButton);

    // Close modal
    const closeButton = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeButton);

    // Check if modal is closed
    expect(screen.queryByRole('button', { name: '✕' })).not.toBeInTheDocument();
  });
});

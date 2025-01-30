import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoryList } from './StoryList';
import { Story } from '../../types/story';
import { describe, it, expect } from 'vitest';

describe('StoryList', () => {
  const mockStories: Story[] = [
    {
      id: '1',
      title: 'Test Story 1',
      userEmail: 'test@example.com',
      sourceText: 'test content',
      article: 'test article',
      read: false,
      createdAt: '2024-01-29T00:00:00.000Z',
      updatedAt: '2024-01-29T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test Story 2',
      userEmail: 'test@example.com',
      sourceText: 'test content 2',
      article: 'test article 2',
      read: false,
      createdAt: '2024-01-29T00:00:00.000Z',
      updatedAt: '2024-01-29T00:00:00.000Z',
    },
  ];

  it('renders story titles and read buttons', () => {
    render(<StoryList stories={mockStories} />);

    expect(screen.getByText('Your Unread Stories')).toBeInTheDocument();
    expect(screen.getByText('Test Story 1')).toBeInTheDocument();
    expect(screen.getByText('Test Story 2')).toBeInTheDocument();
    expect(screen.getAllByText('Read')).toHaveLength(2);
  });

  it('renders empty state message when no stories', () => {
    render(<StoryList stories={[]} />);

    expect(screen.getByText('Your Unread Stories')).toBeInTheDocument();
    expect(screen.getByText('No unread stories available')).toBeInTheDocument();
    expect(screen.queryByText('Read')).not.toBeInTheDocument();
  });
});

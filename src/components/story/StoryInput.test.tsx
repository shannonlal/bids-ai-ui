import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryInput } from './StoryInput';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FrenchIdolContext } from '../french-idol/FrenchIdolContext';

const mockFrenchIdolContext = {
  displayStoryUpload: true,
  storyText: '',
  inputMethod: null,
  setDisplayStoryUpload: vi.fn(),
  setStoryText: vi.fn(),
  setInputMethod: vi.fn(),
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <FrenchIdolContext.Provider value={mockFrenchIdolContext}>{ui}</FrenchIdolContext.Provider>
  );
};

describe('StoryInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders textarea and submit button', () => {
    renderWithContext(<StoryInput />);
    expect(screen.getByPlaceholderText('Paste your story text here...')).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });

  it('shows error when submitting empty text', () => {
    renderWithContext(<StoryInput />);
    fireEvent.click(screen.getByText('Start Practice'));
    expect(screen.getByText('Please enter some text')).toBeInTheDocument();
  });

  it('submits text and updates context when text is valid', async () => {
    renderWithContext(<StoryInput />);
    const textarea = screen.getByPlaceholderText('Paste your story text here...');
    fireEvent.change(textarea, { target: { value: 'Test story' } });
    fireEvent.click(screen.getByText('Start Practice'));

    expect(mockFrenchIdolContext.setStoryText).toHaveBeenCalledWith('Test story');
    expect(mockFrenchIdolContext.setInputMethod).toHaveBeenCalledWith('text');
    expect(mockFrenchIdolContext.setDisplayStoryUpload).toHaveBeenCalledWith(false);
  });

  it('clears error when user starts typing', () => {
    renderWithContext(<StoryInput />);
    fireEvent.click(screen.getByText('Start Practice'));
    expect(screen.getByText('Please enter some text')).toBeInTheDocument();
    const textarea = screen.getByPlaceholderText('Paste your story text here...');
    fireEvent.change(textarea, { target: { value: 'a' } });
    expect(screen.queryByText('Please enter some text')).not.toBeInTheDocument();
  });
});

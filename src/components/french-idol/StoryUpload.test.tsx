import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoryUpload } from './StoryUpload';
import { FrenchIdolContext } from './FrenchIdolContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DynamicComponent = (props: any) => {
      const parsePdf = vi.fn();
      const isLoading = false;
      const error = null;
      return props.children({ parsePdf, isLoading, error });
    };
    return DynamicComponent;
  },
}));

describe('StoryUpload', () => {
  const mockSetDisplayStoryUpload = vi.fn();
  const mockSetStoryText = vi.fn();
  const mockSetInputMethod = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file input and submit button', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: true,
          setDisplayStoryUpload: mockSetDisplayStoryUpload,
          setStoryText: mockSetStoryText,
          storyText: '',
          inputMethod: null,
          setInputMethod: mockSetInputMethod,
          currentUser: null,
          isLoading: false,
          error: null,
          stories: [],
        }}
      >
        <StoryUpload />
      </FrenchIdolContext.Provider>
    );

    expect(screen.getByText('Upload your French PDF story')).toBeInTheDocument();
    expect(screen.getByText('Start Practice')).toBeInTheDocument();
  });

  it('disables submit button when no file is selected', () => {
    render(
      <FrenchIdolContext.Provider
        value={{
          displayStoryUpload: true,
          setDisplayStoryUpload: mockSetDisplayStoryUpload,
          setStoryText: mockSetStoryText,
          storyText: '',
          inputMethod: null,
          setInputMethod: mockSetInputMethod,
          currentUser: null,
          isLoading: false,
          error: null,
          stories: [],
        }}
      >
        <StoryUpload />
      </FrenchIdolContext.Provider>
    );

    const submitButton = screen.getByText('Start Practice');
    expect(submitButton).toBeDisabled();
  });
});

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FrenchIdolView } from './FrenchIdolView';
import { FrenchIdolContext } from './FrenchIdolContext';

describe('FrenchIdolView', () => {
  const renderWithProvider = (displayStoryUpload: boolean) => {
    const mockContextValue = {
      displayStoryUpload,
      setDisplayStoryUpload: () => {},
    };

    return render(
      <FrenchIdolContext.Provider value={mockContextValue}>
        <FrenchIdolView />
      </FrenchIdolContext.Provider>
    );
  };

  it('renders the view with title', () => {
    renderWithProvider(true);
    expect(screen.getByText('French Idol Practice')).toBeInTheDocument();
  });

  it('renders the StoryUpload component when displayStoryUpload is true', () => {
    renderWithProvider(true);
    expect(screen.getByText('Upload your French PDF story')).toBeInTheDocument();
  });

  it('renders loading state when displayStoryUpload is false', () => {
    renderWithProvider(false);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

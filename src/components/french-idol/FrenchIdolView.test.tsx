import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FrenchIdolView } from './FrenchIdolView';
import { FrenchIdolContext } from './FrenchIdolContext';
import { QuizProvider } from './quiz/QuizContext';
import { usePdfParser } from '../../hooks/usePdfParser';

type DynamicImportFn = () => Promise<{
  usePdfParser: typeof import('../../hooks/usePdfParser').usePdfParser;
}>;

interface PDFParserChildrenProps {
  parsePdf: (file: File) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

interface PDFParserProps {
  children: (props: PDFParserChildrenProps) => React.ReactElement;
}

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (_importFn: DynamicImportFn) => {
    const Component = ({ children }: PDFParserProps) => {
      const hookResult = usePdfParser();
      return children(hookResult);
    };
    return Component;
  },
}));

// Mock the PDF parser hook
vi.mock('../../hooks/usePdfParser', () => ({
  usePdfParser: vi.fn().mockReturnValue({
    parsePdf: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));
vi.mock('../../hooks/useDetermineQuestions', () => ({
  determineQuestions: vi.fn().mockResolvedValue(['Test question']),
}));

describe('FrenchIdolView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProvider = (displayStoryUpload: boolean) => {
    const mockContextValue = {
      displayStoryUpload,
      storyText: 'Test story',
      inputMethod: null,
      currentUser: null,
      isLoading: false,
      error: null,
      setDisplayStoryUpload: () => {},
      setStoryText: () => {},
      setInputMethod: () => {},
    };

    return render(
      <FrenchIdolContext.Provider value={mockContextValue}>
        <QuizProvider initialStoryText="Test story">
          <FrenchIdolView />
        </QuizProvider>
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

  it('renders QuizView when displayStoryUpload is false', async () => {
    renderWithProvider(false);
    expect(screen.getByText('French Idol Quiz')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
    });
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });
});

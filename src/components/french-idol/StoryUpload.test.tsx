/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StoryUpload } from './StoryUpload';
import { useFrenchIdol } from './FrenchIdolContext';
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
  default: (_fn: DynamicImportFn) => {
    const Component = ({ children }: PDFParserProps) => {
      const hookResult = usePdfParser();
      return children(hookResult);
    };
    return Component;
  },
}));

// Mock the context
vi.mock('./FrenchIdolContext', () => ({
  useFrenchIdol: vi.fn(),
}));

// Mock the PDF parser hook
vi.mock('../../hooks/usePdfParser', () => ({
  usePdfParser: vi.fn(),
}));

const getFileInput = () => screen.getByTestId('file-input');

describe('StoryUpload', () => {
  const mockSetStoryText = vi.fn();
  const mockSetDisplayStoryUpload = vi.fn();
  const mockParsePdf = vi.fn();

  beforeEach(() => {
    vi.mocked(useFrenchIdol).mockReturnValue({
      displayStoryUpload: true,
      setDisplayStoryUpload: mockSetDisplayStoryUpload,
      setStoryText: mockSetStoryText,
      storyText: '',
      inputMethod: null,
      setInputMethod: vi.fn(),
    });

    vi.mocked(usePdfParser).mockReturnValue({
      parsePdf: mockParsePdf,
      isLoading: false,
      error: null,
    });
  });

  it('renders upload area when displayStoryUpload is true', () => {
    render(<StoryUpload />);
    expect(screen.getByText('Upload your French PDF story')).toBeInTheDocument();
  });

  it('validates PDF file type', async () => {
    render(<StoryUpload />);
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const input = getFileInput();
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('Please upload a PDF file')).toBeInTheDocument();
  });

  it('validates file size', async () => {
    render(<StoryUpload />);
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    const input = getFileInput();
    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(screen.getByText('File size must be less than 10MB')).toBeInTheDocument();
  });

  it('processes valid PDF file', async () => {
    const parsedText = 'Parsed PDF content';
    mockParsePdf.mockResolvedValue(parsedText);
    render(<StoryUpload />);
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const input = getFileInput();
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Start Practice'));

    await waitFor(() => {
      expect(mockParsePdf).toHaveBeenCalledWith(file);
      expect(mockSetStoryText).toHaveBeenCalledWith(parsedText);
      expect(mockSetDisplayStoryUpload).toHaveBeenCalledWith(false);
    });
  });

  it('handles PDF parsing errors', async () => {
    mockParsePdf.mockRejectedValue(new Error('PDF parsing failed'));
    render(<StoryUpload />);
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const input = getFileInput();
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText('Start Practice'));

    await waitFor(() => {
      expect(screen.getByText('Error processing PDF file')).toBeInTheDocument();
    });
  });
});

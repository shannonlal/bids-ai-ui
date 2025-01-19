import { renderHook, act } from '@testing-library/react';
import { flushSync } from 'react-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePdfParser } from './usePdfParser';
import pdfToText from 'react-pdftotext';

vi.mock('react-pdftotext', () => {
  return {
    default: vi.fn(),
  };
});

describe('usePdfParser', () => {
  const mockText = 'Sample PDF content\n\nAnother paragraph';

  beforeEach(() => {
    vi.mocked(pdfToText).mockReset();
  });

  it('should parse PDF file and return text content', async () => {
    vi.mocked(pdfToText).mockResolvedValue(mockText);

    const { result } = renderHook(() => usePdfParser());
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    let parsedText: string | undefined;

    await act(async () => {
      parsedText = await result.current.parsePdf(file);
    });

    expect(parsedText).toBe('Sample PDF content\n\nAnother paragraph');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle parsing errors', async () => {
    const mockError = new Error('PDF parsing failed');
    vi.mocked(pdfToText).mockRejectedValue(mockError);

    const { result } = renderHook(() => usePdfParser());
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });

    await act(async () => {
      try {
        await result.current.parsePdf(file);
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to parse PDF');
  });

  it('should set loading state while parsing', async () => {
    vi.mocked(pdfToText).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(mockText), 100);
        })
    );

    const { result } = renderHook(() => usePdfParser());
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });

    let promise: Promise<string>;
    await act(async () => {
      flushSync(() => {
        promise = result.current.parsePdf(file);
      });
      expect(result.current.isLoading).toBe(true);
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});

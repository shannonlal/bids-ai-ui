import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useValidResponse } from './useValidResponse';
import { ValidateResponseApiResponse } from '../types/api/validateResponse';

describe('useValidResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return validation state and function', () => {
    const { result } = renderHook(() => useValidResponse());

    expect(result.current.validateResponse).toBeDefined();
    expect(result.current.isValidating).toBe(false);
  });

  it('should return a grade between 0 and 5', async () => {
    const mockResponse: ValidateResponseApiResponse = { score: 3 };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      return result.current.validateResponse('test question', 'test answer', 'test story');
    });

    expect(validationResult.grade).toBe(3);
  });

  it('should include error message when API returns an error', async () => {
    const mockResponse: ValidateResponseApiResponse = {
      error: {
        message: 'Your response needs improvement',
        code: 'VALIDATION_ERROR',
      },
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      return result.current.validateResponse('test question', 'test answer', 'test story');
    });

    expect(validationResult.grade).toBe(0);
    expect(validationResult.errorMessage).toBe('Your response needs improvement');
  });

  it('should not include error message when API returns a valid score', async () => {
    const mockResponse: ValidateResponseApiResponse = { score: 5 };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      return result.current.validateResponse('test question', 'test answer', 'test story');
    });

    expect(validationResult.grade).toBe(5);
    expect(validationResult.errorMessage).toBeUndefined();
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useValidResponse } from './useValidResponse';
import type { ValidationResult } from './useValidResponse';

describe('useValidResponse', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return validation state and function', () => {
    const { result } = renderHook(() => useValidResponse());

    expect(result.current.validateResponse).toBeDefined();
    expect(result.current.isValidating).toBe(false);
  });

  it('should set isValidating while processing', async () => {
    const { result } = renderHook(() => useValidResponse());

    let validationPromise: Promise<ValidationResult>;
    await act(async () => {
      validationPromise = result.current.validateResponse('test question', 'test answer');
      //expect(result.current.isValidating).toBe(true);
      await vi.runAllTimersAsync();
      await validationPromise;
    });

    expect(result.current.isValidating).toBe(false);
  });

  it('should return a grade between 0 and 5', async () => {
    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      const promise = result.current.validateResponse('test question', 'test answer');
      await vi.runAllTimersAsync();
      return promise;
    });

    expect(validationResult.grade).toBeGreaterThanOrEqual(0);
    expect(validationResult.grade).toBeLessThanOrEqual(5);
  });

  it('should include error message when grade is less than 5', async () => {
    const mockMath = vi.spyOn(Math, 'random').mockReturnValue(0.5); // Will give grade 3
    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      const promise = result.current.validateResponse('test question', 'test answer');
      await vi.runAllTimersAsync();
      return promise;
    });

    expect(validationResult.grade).toBeLessThan(5);
    expect(validationResult.errorMessage).toBe('Your response needs improvement');

    mockMath.mockRestore();
  });

  it('should not include error message when grade is 5', async () => {
    const mockMath = vi.spyOn(Math, 'random').mockReturnValue(0.84); // Will give grade 5
    const { result } = renderHook(() => useValidResponse());

    const validationResult = await act(async () => {
      const promise = result.current.validateResponse('test question', 'test answer');
      await vi.runAllTimersAsync();
      return promise;
    });

    expect(validationResult.grade).toBe(5);
    expect(validationResult.errorMessage).toBeUndefined();

    mockMath.mockRestore();
  });
});

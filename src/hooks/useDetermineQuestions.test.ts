import { describe, it, expect, beforeEach, vi } from 'vitest';
import { determineQuestions } from './useDetermineQuestions';

describe('determineQuestions', () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  it('should return an array of questions from the API', async () => {
    const mockQuestions = ['Question 1?', 'Question 2?', 'Question 3?'];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    const storyText = 'This is a sample story';
    const questions = await determineQuestions(storyText);

    expect(global.fetch).toHaveBeenCalledWith('/api/generateQuestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ story: storyText }),
    });
    expect(questions).toEqual(mockQuestions);
  });

  it('should throw error when API call fails', async () => {
    const errorMessage = 'API Error';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: errorMessage } }),
    });

    const storyText = 'This is a sample story';
    await expect(determineQuestions(storyText)).rejects.toThrow(errorMessage);
  });
});

import { describe, it, expect } from 'vitest';
import { determineQuestions } from './useDetermineQuestions';

describe('determineQuestions', () => {
  it('should return an array of questions', async () => {
    const storyText = 'This is a sample story';
    const questions = await determineQuestions(storyText);

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThanOrEqual(1);
    expect(questions.length).toBeLessThanOrEqual(5);
  });

  it('should return different number of questions on multiple calls', async () => {
    const storyText = 'This is a sample story';
    const results = await Promise.all([
      determineQuestions(storyText),
      determineQuestions(storyText),
      determineQuestions(storyText),
    ]);

    // Check if at least two arrays have different lengths
    const uniqueLengths = new Set(results.map(r => r.length));
    expect(uniqueLengths.size).toBeGreaterThan(1);
  });

  it('should return string questions', async () => {
    const storyText = 'This is a sample story';
    const questions = await determineQuestions(storyText);

    questions.forEach(question => {
      expect(typeof question).toBe('string');
      expect(question.length).toBeGreaterThan(0);
    });
  });
});

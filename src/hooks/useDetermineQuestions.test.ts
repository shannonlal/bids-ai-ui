import { describe, it, expect } from 'vitest';
import { useDetermineQuestions } from './useDetermineQuestions';

describe('useDetermineQuestions', () => {
  it('should return an array of questions', async () => {
    const storyText = 'This is a sample story';
    const questions = await useDetermineQuestions(storyText);

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThanOrEqual(1);
    expect(questions.length).toBeLessThanOrEqual(5);
  });

  it('should return different number of questions on multiple calls', async () => {
    const storyText = 'This is a sample story';
    const results = await Promise.all([
      useDetermineQuestions(storyText),
      useDetermineQuestions(storyText),
      useDetermineQuestions(storyText),
    ]);

    // Check if at least two arrays have different lengths
    const uniqueLengths = new Set(results.map(r => r.length));
    expect(uniqueLengths.size).toBeGreaterThan(1);
  });

  it('should return string questions', async () => {
    const storyText = 'This is a sample story';
    const questions = await useDetermineQuestions(storyText);

    questions.forEach(question => {
      expect(typeof question).toBe('string');
      expect(question.length).toBeGreaterThan(0);
    });
  });
});

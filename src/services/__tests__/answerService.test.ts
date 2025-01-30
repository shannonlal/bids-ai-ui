import { describe, expect, it, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { Answer, IAnswerDocument } from '../../models/Answer';
import { answerService } from '../answerService';

// Mock MongoDB connection
vi.mock('../../lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(mongoose),
}));

describe('AnswerService', () => {
  const mockEmail = 'test@example.com';
  const mockStoryId = new mongoose.Types.ObjectId().toString();
  const mockQuestion = 'What is the main idea of the story?';
  const mockAnswer = 'The main idea is about friendship.';
  const mockScore = 85;
  const mockCorrection = 'Good answer, but could be more specific.';

  const mockAnswerDoc: Partial<IAnswerDocument> = {
    _id: new mongoose.Types.ObjectId(),
    userEmail: mockEmail.toLowerCase(),
    storyId: new mongoose.Types.ObjectId(mockStoryId),
    question: mockQuestion,
    answer: mockAnswer,
    score: mockScore,
    correction: mockCorrection,
    createdAt: '2024-01-29T12:00:00.000Z',
    updatedAt: '2024-01-29T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveAnswer', () => {
    it('should save a new answer', async () => {
      // Mock the Answer constructor and save method
      const saveMock = vi.fn().mockResolvedValueOnce(mockAnswerDoc);
      vi.spyOn(Answer.prototype, 'save').mockImplementationOnce(saveMock);

      const result = await answerService.saveAnswer(
        mockEmail,
        mockStoryId,
        mockQuestion,
        mockAnswer,
        mockScore,
        mockCorrection
      );

      expect(result).toEqual({
        id: mockAnswerDoc._id!.toString(),
        userEmail: mockEmail.toLowerCase(),
        storyId: mockStoryId,
        question: mockQuestion,
        answer: mockAnswer,
        score: mockScore,
        correction: mockCorrection,
        createdAt: mockAnswerDoc.createdAt,
        updatedAt: mockAnswerDoc.updatedAt,
      });
    });
  });

  describe('getUserAnswers', () => {
    it('should retrieve all answers for a user', async () => {
      const mockAnswers = [
        mockAnswerDoc,
        {
          ...mockAnswerDoc,
          _id: new mongoose.Types.ObjectId(),
          question: 'Another question?',
          answer: 'Another answer',
          score: 90,
          correction: 'Well done!',
        },
      ];

      // Mock the Answer.find method
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce(mockAnswers),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getUserAnswers(mockEmail);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        id: mockAnswerDoc._id!.toString(),
        userEmail: mockEmail.toLowerCase(),
        storyId: mockStoryId,
        question: mockQuestion,
        answer: mockAnswer,
        score: mockScore,
        correction: mockCorrection,
        createdAt: mockAnswerDoc.createdAt,
        updatedAt: mockAnswerDoc.updatedAt,
      });
    });

    it('should return empty array when user has no answers', async () => {
      // Mock the Answer.find method to return empty array
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getUserAnswers('nonexistent@example.com');
      expect(results).toEqual([]);
    });
  });

  describe('getAnswersByStory', () => {
    it('should retrieve all answers for a story', async () => {
      const mockAnswers = [
        mockAnswerDoc,
        {
          ...mockAnswerDoc,
          _id: new mongoose.Types.ObjectId(),
          userEmail: 'another@example.com',
          answer: 'Different answer',
          score: 75,
          correction: 'Good try',
        },
      ];

      // Mock the Answer.find method
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce(mockAnswers),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getAnswersByStory(mockStoryId);

      expect(results).toHaveLength(2);
      expect(results[0].storyId).toBe(mockStoryId);
      expect(results[1].storyId).toBe(mockStoryId);
    });

    it('should return empty array when story has no answers', async () => {
      // Mock the Answer.find method to return empty array
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getAnswersByStory(
        new mongoose.Types.ObjectId().toString()
      );
      expect(results).toEqual([]);
    });
  });

  describe('getUserAnswersForStory', () => {
    it('should retrieve all answers for a user and story', async () => {
      const mockAnswers = [
        mockAnswerDoc,
        {
          ...mockAnswerDoc,
          _id: new mongoose.Types.ObjectId(),
          question: 'Another question?',
          answer: 'Another answer',
          score: 90,
          correction: 'Well done!',
        },
      ];

      // Mock the Answer.find method
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce(mockAnswers),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getUserAnswersForStory(mockEmail, mockStoryId);

      expect(results).toHaveLength(2);
      results.forEach(result => {
        expect(result.userEmail).toBe(mockEmail.toLowerCase());
        expect(result.storyId).toBe(mockStoryId);
      });
    });

    it('should return empty array when user has no answers for story', async () => {
      // Mock the Answer.find method to return empty array
      vi.spyOn(Answer, 'find').mockReturnValueOnce({
        sort: vi.fn().mockResolvedValueOnce([]),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const results = await answerService.getUserAnswersForStory(
        'nonexistent@example.com',
        mockStoryId
      );
      expect(results).toEqual([]);
    });
  });
});

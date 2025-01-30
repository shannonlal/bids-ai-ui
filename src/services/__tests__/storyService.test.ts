import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { storyService } from '../storyService';
import { Story, IStoryDocument } from '../../models/Story';
import connectDB from '../../lib/mongodb';

// Mock the MongoDB connection
vi.mock('../../lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(mongoose),
}));

describe('StoryService', () => {
  const mockStory: Partial<IStoryDocument> = {
    _id: new mongoose.Types.ObjectId(),
    userEmail: 'test@example.com',
    title: 'Test Story',
    sourceText: 'Original text',
    article: 'Generated article',
    read: false,
    createdAt: '2024-01-29T12:00:00.000Z',
    updatedAt: '2024-01-29T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveStory', () => {
    it('should save a new story successfully', async () => {
      // Mock the Story.prototype.save method
      const saveSpy = vi
        .spyOn(Story.prototype, 'save')
        .mockResolvedValueOnce(mockStory as IStoryDocument);

      const result = await storyService.saveStory(
        'test@example.com',
        'Test Story',
        'Original text',
        'Generated article'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockStory._id!.toString(),
        userEmail: mockStory.userEmail,
        title: mockStory.title,
        sourceText: mockStory.sourceText,
        article: mockStory.article,
        read: mockStory.read,
        createdAt: mockStory.createdAt,
        updatedAt: mockStory.updatedAt,
      });
      expect(result.read).toBe(false); // Verify read flag is set to false
    });

    it('should handle save failure', async () => {
      // Mock save to throw an error
      vi.spyOn(Story.prototype, 'save').mockRejectedValueOnce(new Error('Save failed'));

      await expect(
        storyService.saveStory(
          'test@example.com',
          'Test Story',
          'Original text',
          'Generated article'
        )
      ).rejects.toThrow('Save failed');

      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('getUserStories', () => {
    it('should return stories filtered by read status', async () => {
      const mockStories = [
        mockStory,
        {
          ...mockStory,
          _id: new mongoose.Types.ObjectId(),
          title: 'Another Story',
          read: true,
        },
      ];

      // Mock the Story.find method
      vi.spyOn(Story, 'find').mockResolvedValueOnce([mockStories[0]] as IStoryDocument[]);

      const result = await storyService.getUserStories('test@example.com', false);

      expect(connectDB).toHaveBeenCalled();
      expect(Story.find).toHaveBeenCalledWith({
        userEmail: 'test@example.com',
        read: false,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockStories[0]._id!.toString(),
        userEmail: mockStories[0].userEmail,
        title: mockStories[0].title,
        sourceText: mockStories[0].sourceText,
        article: mockStories[0].article,
        read: mockStories[0].read,
        createdAt: mockStories[0].createdAt,
        updatedAt: mockStories[0].updatedAt,
      });
    });

    it('should return empty array when no stories exist', async () => {
      // Mock the Story.find method to return empty array
      vi.spyOn(Story, 'find').mockResolvedValueOnce([]);

      const result = await storyService.getUserStories('test@example.com', true);

      expect(connectDB).toHaveBeenCalled();
      expect(Story.find).toHaveBeenCalledWith({
        userEmail: 'test@example.com',
        read: true,
      });
      expect(result).toEqual([]);
    });
  });

  describe('markStoryRead', () => {
    it('should mark a story as read successfully', async () => {
      const updatedMockStory = {
        ...mockStory,
        read: true,
        updatedAt: '2024-01-29T13:00:00.000Z',
      };

      // Create a mock document with save method
      const mockDocument = {
        ...mockStory,
        save: vi.fn().mockResolvedValueOnce(updatedMockStory),
      } as unknown as IStoryDocument;

      // Mock findOne to return the document
      vi.spyOn(Story, 'findOne').mockResolvedValueOnce(mockDocument);

      const result = await storyService.markStoryRead(
        'test@example.com',
        mockStory._id!.toString()
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Story.findOne).toHaveBeenCalledWith({
        _id: mockStory._id!.toString(),
        userEmail: 'test@example.com',
      });
      expect(result).toEqual({
        id: updatedMockStory._id!.toString(),
        userEmail: updatedMockStory.userEmail,
        title: updatedMockStory.title,
        sourceText: updatedMockStory.sourceText,
        article: updatedMockStory.article,
        read: true,
        createdAt: updatedMockStory.createdAt,
        updatedAt: updatedMockStory.updatedAt,
      });
    });

    it('should throw error when story not found', async () => {
      // Mock findOne to return null
      vi.spyOn(Story, 'findOne').mockResolvedValueOnce(null);

      const storyId = new mongoose.Types.ObjectId().toString();
      await expect(storyService.markStoryRead('test@example.com', storyId)).rejects.toThrow(
        `Story not found with id: ${storyId} for user: test@example.com`
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Story.findOne).toHaveBeenCalledWith({
        _id: storyId,
        userEmail: 'test@example.com',
      });
    });

    it('should handle save failure when marking as read', async () => {
      // Create a mock document with save method that throws
      const mockDocument = {
        ...mockStory,
        save: vi.fn().mockRejectedValueOnce(new Error('Save failed')),
      } as unknown as IStoryDocument;

      // Mock findOne to return the document
      vi.spyOn(Story, 'findOne').mockResolvedValueOnce(mockDocument);

      await expect(
        storyService.markStoryRead('test@example.com', mockStory._id!.toString())
      ).rejects.toThrow('Save failed');

      expect(connectDB).toHaveBeenCalled();
    });
  });
});

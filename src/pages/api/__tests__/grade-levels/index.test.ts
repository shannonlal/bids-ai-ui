import { vi } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import handler from '../../grade-levels';
import { GradeLevel } from '../../../../models/GradeLevel';
import { GradeLevelsResponse } from '../../../../types/gradeLevel';

// Mock MongoDB connection
vi.mock('../../../../lib/mongodb', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(mongoose),
}));

describe('Grade Levels API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse<GradeLevelsResponse>>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('returns 405 for non-GET methods', async () => {
    mockReq = {
      method: 'POST',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Method not allowed',
    });
  });

  it('returns grade levels successfully', async () => {
    const mockGradeLevels = [
      {
        _id: new mongoose.Types.ObjectId(),
        grade: 1,
        levelName: 'Beginner',
        averageAge: 6,
        numberOfQuestions: 5,
        instructions: 'Simple questions for beginners',
        storyWordCount: 100,
        toObject: () => ({
          _id: new mongoose.Types.ObjectId(),
          grade: 1,
          levelName: 'Beginner',
          averageAge: 6,
          numberOfQuestions: 5,
          instructions: 'Simple questions for beginners',
          storyWordCount: 100,
        }),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        grade: 2,
        levelName: 'Elementary',
        averageAge: 7,
        numberOfQuestions: 8,
        instructions: 'Basic comprehension questions',
        storyWordCount: 150,
        toObject: () => ({
          _id: new mongoose.Types.ObjectId(),
          grade: 2,
          levelName: 'Elementary',
          averageAge: 7,
          numberOfQuestions: 8,
          instructions: 'Basic comprehension questions',
          storyWordCount: 150,
        }),
      },
    ];

    // Mock the find method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(GradeLevel, 'find').mockResolvedValueOnce(mockGradeLevels as any);

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    const data = jsonMock.mock.calls[0][0] as GradeLevelsResponse;
    expect(data.gradeLevels).toHaveLength(2);
    expect(data.gradeLevels[0]).toEqual({
      id: mockGradeLevels[0]._id.toString(),
      grade: mockGradeLevels[0].grade,
      levelName: mockGradeLevels[0].levelName,
      averageAge: mockGradeLevels[0].averageAge,
      numberOfQuestions: mockGradeLevels[0].numberOfQuestions,
      instructions: mockGradeLevels[0].instructions,
      storyWordCount: mockGradeLevels[0].storyWordCount,
    });
  });

  it('handles errors appropriately', async () => {
    // Mock the find method to throw an error
    vi.spyOn(GradeLevel, 'find').mockRejectedValueOnce(new Error('Database error'));

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Failed to fetch grade levels',
    });
  });
});

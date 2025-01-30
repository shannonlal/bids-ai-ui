import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../stories/getStoryAnswers';
import { answerService } from '../../../../services/answerService';
import { Answer } from '../../../../types/answer';

vi.mock('../../../../services/answerService', () => ({
  answerService: {
    getUserAnswersForStory: vi.fn(),
  },
}));

describe('getStoryAnswers API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  const mockAnswers: Answer[] = [
    {
      id: '1',
      userEmail: 'test@example.com',
      storyId: 'story123',
      question: 'Test question?',
      answer: 'Test answer',
      score: 80,
      correction: 'Good answer',
      createdAt: '2025-01-30T00:00:00.000Z',
      updatedAt: '2025-01-30T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('returns 405 for non-GET requests', async () => {
    mockReq = {
      method: 'POST',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Method not allowed',
    });
  });

  it('returns 400 if storyId is missing', async () => {
    mockReq = {
      method: 'GET',
      query: {
        email: 'test@example.com',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Story ID is required',
    });
  });

  it('returns 400 if email is missing', async () => {
    mockReq = {
      method: 'GET',
      query: {
        storyId: 'story123',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Email is required',
    });
  });

  it('returns 404 if no answers are found', async () => {
    mockReq = {
      method: 'GET',
      query: {
        storyId: 'story123',
        email: 'test@example.com',
      },
    };

    (answerService.getUserAnswersForStory as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'No answers found for this story',
    });
  });

  it('returns 200 with answers when found', async () => {
    mockReq = {
      method: 'GET',
      query: {
        storyId: 'story123',
        email: 'test@example.com',
      },
    };

    (answerService.getUserAnswersForStory as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockAnswers
    );

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      answers: [
        {
          id: '1',
          question: 'Test question?',
          answer: 'Test answer',
          score: 80,
          correction: 'Good answer',
        },
      ],
    });
  });

  it('returns 500 when service throws error', async () => {
    mockReq = {
      method: 'GET',
      query: {
        storyId: 'story123',
        email: 'test@example.com',
      },
    };

    (answerService.getUserAnswersForStory as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Database error')
    );

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Error fetching story answers',
    });
  });
});

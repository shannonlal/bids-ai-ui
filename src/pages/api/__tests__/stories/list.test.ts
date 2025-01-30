import { vi } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, beforeEach } from 'vitest';
import handler from '../../stories/list';
import { ListStoriesResponse } from '../../../../types/api/listStories';
import { Story } from '../../../../types/story';

// Mock the story service
vi.mock('../../../../services/storyService', () => ({
  storyService: {
    getUserStories: vi.fn(),
  },
}));

import { storyService } from '../../../../services/storyService';

describe('Stories List API', () => {
  const mockStories: Story[] = [
    {
      id: '1',
      userEmail: 'test@example.com',
      sourceText: 'source',
      title: 'Test Story',
      article: 'content',
      read: false,
      createdAt: '2024-01-29T00:00:00.000Z',
      updatedAt: '2024-01-29T00:00:00.000Z',
    },
  ];

  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse<ListStoriesResponse | { error: string }>>;
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

  it('should return stories for valid email and read status', async () => {
    mockReq = {
      method: 'GET',
      query: {
        email: 'test@example.com',
        read: 'false',
      },
    };

    vi.mocked(storyService.getUserStories).mockResolvedValueOnce(mockStories);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ stories: mockStories });
    expect(storyService.getUserStories).toHaveBeenCalledWith('test@example.com', false);
  });

  it('should default to unread stories when read status is not provided', async () => {
    mockReq = {
      method: 'GET',
      query: {
        email: 'test@example.com',
      },
    };

    vi.mocked(storyService.getUserStories).mockResolvedValueOnce(mockStories);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(storyService.getUserStories).toHaveBeenCalledWith('test@example.com', false);
  });

  it('should return 400 when email is missing', async () => {
    mockReq = {
      method: 'GET',
      query: {
        read: 'false',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Email is required' });
  });

  it('should return 400 for invalid read status', async () => {
    mockReq = {
      method: 'GET',
      query: {
        email: 'test@example.com',
        read: 'invalid',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid read status value' });
  });

  it('should return 405 for non-GET requests', async () => {
    mockReq = {
      method: 'POST',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should return 500 when service throws error', async () => {
    mockReq = {
      method: 'GET',
      query: {
        email: 'test@example.com',
        read: 'false',
      },
    };

    vi.mocked(storyService.getUserStories).mockRejectedValueOnce(new Error('Database error'));

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

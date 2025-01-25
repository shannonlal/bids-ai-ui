import type { NextApiRequest, NextApiResponse } from 'next';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import handler from '../generateStory';
import { GenerateStoryApiResponse } from '../../../types/api/generateStory';
import MockOpenAI, { mockCreate } from '../../../test/mocks/openai';

vi.mock('openai', () => ({
  default: MockOpenAI,
}));

vi.mock('process', () => ({
  env: {
    OPENAI_API_KEY: 'test-key',
  },
}));

describe('generateStory API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse<GenerateStoryApiResponse>>;
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

  it('returns 405 for non-POST requests', async () => {
    mockReq = {
      method: 'GET',
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      },
    });
  });

  it('returns 400 when text is missing', async () => {
    mockReq = {
      method: 'POST',
      body: {},
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Text field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('returns 400 when text is not a string', async () => {
    mockReq = {
      method: 'POST',
      body: { text: 123 },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Text field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('successfully generates a story', async () => {
    const mockStory = 'Once upon a time...';
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: mockStory,
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: { text: 'Generate a story about a dragon' },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ story: mockStory });
  });

  it('handles OpenAI API errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    mockReq = {
      method: 'POST',
      body: { text: 'Generate a story about a dragon' },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Failed to generate story',
        code: 'OPENAI_ERROR',
      },
    });
  });
});

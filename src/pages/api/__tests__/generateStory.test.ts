import { vi } from 'vitest';

// Mock modules before imports
vi.mock('openai');

// Mock process.env
const processEnv = process.env;
vi.spyOn(process, 'env', 'get').mockReturnValue({
  ...processEnv,
  OPENAI_API_KEY: 'test-key',
});

import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateStoryApiResponse } from '../../../types/api/generateStory';
import { mockCreate } from '../__mocks__/openai';
import handler from '../generateStory';

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

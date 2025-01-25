import { vi } from 'vitest';

// Mock modules before imports
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

// Mock process.env
const processEnv = process.env;
vi.spyOn(process, 'env', 'get').mockReturnValue({
  ...processEnv,
  OPENAI_API_KEY: 'test-key',
});

import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateQuestionsApiResponse } from '../../../types/api/generateQuestions';
import { mockCreate } from '../../../test/mocks/openai';
import handler from '../generateQuestions';

describe('generateQuestions API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse<GenerateQuestionsApiResponse>>;
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

  it('returns 400 if story is missing', async () => {
    mockReq = {
      method: 'POST',
      body: {},
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Story field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('returns 400 if story is not a string', async () => {
    mockReq = {
      method: 'POST',
      body: { story: 123 },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Story field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('successfully generates questions', async () => {
    const mockQuestions = {
      questions: ['Question 1 en français?', 'Question 2 en français?', 'Question 3 en français?'],
    };

    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockQuestions),
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: { story: 'Test story content' },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockQuestions);
  });

  it('handles OpenAI API errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    mockReq = {
      method: 'POST',
      body: { story: 'Test story content' },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Failed to generate questions',
        code: 'OPENAI_ERROR',
      },
    });
  });

  it('handles invalid JSON response from OpenAI', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Invalid JSON response',
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: { story: 'Test story content' },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Failed to parse generated questions',
        code: 'PARSE_ERROR',
      },
    });
  });
});

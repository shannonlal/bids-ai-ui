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
import { ValidateResponseApiResponse } from '../../../types/api/validateResponse';
import { mockCreate } from '../../../test/mocks/openai';
import handler from '../validateResponse';

describe('validateResponse API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse<ValidateResponseApiResponse>>;
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
      body: {
        story: 123,
        question: 'test question',
        response: 'test response',
      },
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

  it('returns 400 if question is missing', async () => {
    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        response: 'test response',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Question field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('returns 400 if response is missing', async () => {
    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        question: 'test question',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Response field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  });

  it('successfully validates response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              score: 4.5,
              correction:
                'Excellent travail! Votre réponse est très précise et bien structurée. Continuez comme ça!',
            }),
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        question: 'test question',
        response: 'test response',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      score: 4.5,
      correction:
        'Excellent travail! Votre réponse est très précise et bien structurée. Continuez comme ça!',
    });
  });

  it('handles invalid response format from OpenAI', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'invalid json',
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        question: 'test question',
        response: 'test response',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Failed to parse validation response',
        code: 'PARSE_ERROR',
      },
    });
  });

  it('handles missing fields in OpenAI response', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              score: 4.5,
              // missing correction field
            }),
          },
        },
      ],
    });

    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        question: 'test question',
        response: 'test response',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Invalid response format from validation',
        code: 'INVALID_RESPONSE_FORMAT',
      },
    });
  });

  it('handles OpenAI API errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    mockReq = {
      method: 'POST',
      body: {
        story: 'test story',
        question: 'test question',
        response: 'test response',
      },
    };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        message: 'Failed to validate response',
        code: 'OPENAI_ERROR',
      },
    });
  });
});

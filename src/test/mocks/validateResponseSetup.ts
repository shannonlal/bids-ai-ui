import { vi, beforeEach, afterEach } from 'vitest';
import { mockCreate } from './openai';

// Mock OpenAI module
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

export const setupValidateResponseMocks = () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });
};

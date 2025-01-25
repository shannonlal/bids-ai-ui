import { vi } from 'vitest';

const mockOpenAI = vi.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: vi.fn(),
    },
  },
}));

export default mockOpenAI;

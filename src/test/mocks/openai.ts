import { vi } from 'vitest';

export const mockCreate = vi.fn();

export const mockOpenAI = {
  chat: {
    completions: {
      create: mockCreate,
    },
  },
};

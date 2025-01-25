import { vi } from 'vitest';

export const mockCreate = vi.fn();

class MockOpenAI {
  chat = {
    completions: {
      create: mockCreate,
    },
  };
}

export default MockOpenAI;

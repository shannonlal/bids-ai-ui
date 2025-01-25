import { vi } from 'vitest';

const mockCreate = vi.fn();

interface OpenAIInstance {
  chat: {
    completions: {
      create: typeof mockCreate;
    };
  };
}

function OpenAI(this: OpenAIInstance) {
  this.chat = {
    completions: {
      create: mockCreate,
    },
  };
  return this;
}

export { mockCreate };
export default OpenAI as unknown as typeof import('openai').default;

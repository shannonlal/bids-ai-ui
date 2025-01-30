import { Story } from '../story';

export interface GenerateStoryRequest {
  text: string;
  email: string;
}

export interface GenerateStoryResponse {
  story: Story;
  error?: never;
}

export interface GenerateStoryError {
  story?: never;
  error: {
    message: string;
    code: string;
  };
}

export type GenerateStoryApiResponse = GenerateStoryResponse | GenerateStoryError;

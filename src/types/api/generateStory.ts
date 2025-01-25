export interface GenerateStoryRequest {
  text: string;
}

export interface GenerateStoryResponse {
  story: string;
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

export interface GenerateQuestionsRequest {
  story: string;
}

export interface GenerateQuestionsResponse {
  questions: string[];
  error?: never;
}

export interface GenerateQuestionsError {
  questions?: never;
  error: {
    message: string;
    code: string;
  };
}

export type GenerateQuestionsApiResponse = GenerateQuestionsResponse | GenerateQuestionsError;

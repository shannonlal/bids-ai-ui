export interface ValidateResponseRequest {
  story: string;
  question: string;
  response: string;
  userEmail: string;
  storyId: string;
}

export interface ValidateResponseSuccess {
  score: number;
  correction: string;
  savedAnswer: {
    id: string;
    userEmail: string;
    storyId: string;
    question: string;
    answer: string;
    score: number;
    correction: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: never;
}

export interface ValidateResponseError {
  score?: never;
  error: {
    message: string;
    code: string;
  };
}

export type ValidateResponseApiResponse = ValidateResponseSuccess | ValidateResponseError;

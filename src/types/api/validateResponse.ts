export interface ValidateResponseRequest {
  story: string;
  question: string;
  response: string;
}

export interface ValidateResponseSuccess {
  score: number;
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

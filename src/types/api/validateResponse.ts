export interface ValidationInput {
  story: string;
  question: string;
  response: string;
  userEmail: string;
  storyId: string;
}

export interface StudentEvaluation {
  score: number;
  correction: string;
  suggestedAnswer: string;
}

export interface TeacherReview {
  isScoreAccurate: boolean;
  finalScore: number;
  finalCorrection: string;
  reviewComments: string;
}

export interface ValidateResponseApiResponse {
  score?: number;
  correction?: string;
  suggestedAnswer?: string;
  reviewComments?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedAnswer?: any;
  error?: {
    message: string;
    code: string;
  };
}

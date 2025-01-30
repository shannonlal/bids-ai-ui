export interface GetStoryAnswersResponse {
  answers: {
    id: string;
    question: string;
    answer: string;
    score: number;
    correction: string;
  }[];
}

export interface GetStoryAnswersError {
  message: string;
}

/**
 * Interface representing an Answer in the frontend
 */
export interface Answer {
  id: string;
  userEmail: string;
  storyId: string;
  question: string;
  answer: string;
  score: number;
  correction: string;
  suggestedAnswer: string;
  createdAt: string;
  updatedAt: string;
}

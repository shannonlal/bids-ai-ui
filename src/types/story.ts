/**
 * Interface representing a Story in the frontend
 */
export interface Story {
  id: string;
  userEmail: string;
  sourceText: string;
  title: string;
  article: string;
  read: boolean;
  quizScore?: number | null;
  totalQuestions?: number | null;
  createdAt: string;
  updatedAt: string;
}

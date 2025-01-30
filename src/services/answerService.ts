import { Answer, mapAnswerToDTO } from '../models/Answer';
import connectDB from '../lib/mongodb';
import { Answer as AnswerType } from '../types/answer';

/**
 * Service class for handling answer-related operations
 */
export class AnswerService {
  /**
   * Saves a new answer for a user
   * @param email - The user's email address
   * @param storyId - The ID of the story being answered
   * @param question - The question being answered
   * @param answer - The user's answer
   * @param score - The score for the answer (0-100)
   * @param correction - The correction/feedback for the answer
   * @returns The saved answer data transformed to frontend type
   */
  async saveAnswer(
    email: string,
    storyId: string,
    question: string,
    answer: string,
    score: number,
    correction: string,
    suggestedAnswer: string
  ): Promise<AnswerType> {
    await connectDB();
    console.log('Creating new answer for user:', email);

    const now = new Date().toISOString();
    const answerDoc = new Answer({
      userEmail: email.toLowerCase(),
      storyId,
      question,
      answer,
      score,
      correction,
      suggestedAnswer,
      createdAt: now,
      updatedAt: now,
    });

    const savedAnswer = await answerDoc.save();
    console.log('Saved answer:', savedAnswer);

    return mapAnswerToDTO(savedAnswer);
  }

  /**
   * Retrieves all answers for a user
   * @param email - The user's email address
   * @returns Array of answers transformed to frontend type
   */
  async getUserAnswers(email: string): Promise<AnswerType[]> {
    await connectDB();
    console.log('Fetching answers for user:', email);

    const answers = await Answer.find({
      userEmail: email.toLowerCase(),
    }).sort({ createdAt: -1 }); // Most recent first

    console.log(`Found ${answers.length} answers`);

    return answers.map(mapAnswerToDTO);
  }

  /**
   * Retrieves all answers for a specific story
   * @param storyId - The story ID
   * @returns Array of answers transformed to frontend type
   */
  async getAnswersByStory(storyId: string): Promise<AnswerType[]> {
    await connectDB();
    console.log('Fetching answers for story:', storyId);

    const answers = await Answer.find({ storyId }).sort({ createdAt: -1 }); // Most recent first
    console.log(`Found ${answers.length} answers for story`);

    return answers.map(mapAnswerToDTO);
  }

  /**
   * Retrieves all answers for a user for a specific story
   * @param email - The user's email address
   * @param storyId - The story ID
   * @returns Array of answers transformed to frontend type
   */
  async getUserAnswersForStory(email: string, storyId: string): Promise<AnswerType[]> {
    await connectDB();
    console.log('Fetching answers for user:', email, 'and story:', storyId);

    const answers = await Answer.find({
      userEmail: email.toLowerCase(),
      storyId,
    }).sort({ createdAt: -1 }); // Most recent first

    console.log(`Found ${answers.length} answers`);

    return answers.map(mapAnswerToDTO);
  }
}

// Export a singleton instance
export const answerService = new AnswerService();

import { Story, mapStoryToDTO } from '../models/Story';
import connectDB from '../lib/mongodb';
import { Story as StoryType } from '../types/story';

/**
 * Service class for handling story-related operations
 */
export class StoryService {
  /**
   * Saves a new story for a user
   * @param email - The user's email address
   * @param title - The story title
   * @param sourceText - The original source text
   * @param article - The generated article
   * @returns The saved story data transformed to frontend type
   */
  async saveStory(
    email: string,
    title: string,
    sourceText: string,
    article: string
  ): Promise<StoryType> {
    await connectDB();
    console.log('Creating new story for user:', email);

    const now = new Date().toISOString();
    const story = new Story({
      userEmail: email.toLowerCase(),
      title,
      sourceText,
      article,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    const savedStory = await story.save();
    console.log('Saved story:', savedStory);

    return mapStoryToDTO(savedStory);
  }

  /**
   * Retrieves stories for a user filtered by read status
   * @param email - The user's email address
   * @param read - The read status to filter by
   * @returns Array of stories transformed to frontend type
   */
  async getUserStories(email: string, read: boolean): Promise<StoryType[]> {
    await connectDB();
    console.log('Fetching stories for user:', email, 'with read status:', read);

    const stories = await Story.find({
      userEmail: email.toLowerCase(),
      read,
    });
    console.log(`Found ${stories.length} stories`);

    return stories.map(mapStoryToDTO);
  }

  /**
   * Marks a story as read and saves the quiz score
   * @param email - The user's email address
   * @param id - The story ID
   * @param quizScore - The score achieved in the quiz
   * @param totalQuestions - The total number of questions in the quiz
   * @returns The updated story data transformed to frontend type
   * @throws Error if story is not found or doesn't belong to the user
   */
  async markStoryRead(
    email: string,
    id: string,
    quizScore: number,
    totalQuestions: number
  ): Promise<StoryType> {
    await connectDB();
    console.log('Marking story as read with score:', id, 'for user:', email);

    const story = await Story.findOne({
      _id: id,
      userEmail: email.toLowerCase(),
    });

    if (!story) {
      throw new Error(`Story not found with id: ${id} for user: ${email}`);
    }

    story.read = true;
    story.quizScore = quizScore;
    story.totalQuestions = totalQuestions;
    story.updatedAt = new Date().toISOString();

    const updatedStory = await story.save();
    console.log('Updated story:', updatedStory);

    return mapStoryToDTO(updatedStory);
  }
}

// Export a singleton instance
export const storyService = new StoryService();

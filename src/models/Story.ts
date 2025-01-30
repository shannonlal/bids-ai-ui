import mongoose, { Document, Schema } from 'mongoose';
import { Story as StoryType } from '../types/story';

/**
 * Interface for the Story document in MongoDB
 */
export interface IStoryDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userEmail: string;
  sourceText: string;
  title: string;
  article: string;
  read: boolean;
  quizScore: number | null;
  totalQuestions: number | null;
  questionResponses: string[] | null;
  questionCorrections: string[] | null;
  questions: string[] | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mongoose schema definition for Story
 */
const storySchema = new Schema<IStoryDocument>(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    sourceText: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    article: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
    quizScore: {
      type: Number,
      required: false,
      default: null,
    },
    totalQuestions: {
      type: Number,
      required: false,
      default: null,
    },
    questionResponses: {
      type: [String],
      required: false,
      default: null,
    },
    questionCorrections: {
      type: [String],
      required: false,
      default: null,
    },
    questions: {
      type: [String],
      required: false,
      default: null,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'Story', // Explicitly set collection name
  }
);

// Model name for caching
const MODEL_NAME = 'french-idol.Story';

// Create and export the model
// Using type assertion since the model might not exist yet in Next.js hot reloading
export const Story =
  (mongoose.models[MODEL_NAME] as mongoose.Model<IStoryDocument>) ||
  mongoose.model<IStoryDocument>(MODEL_NAME, storySchema);

// Utility function to transform MongoDB document to frontend type
export function mapStoryToDTO(story: IStoryDocument): StoryType {
  return {
    id: story._id.toString(),
    userEmail: story.userEmail,
    sourceText: story.sourceText,
    title: story.title,
    article: story.article,
    read: story.read,
    quizScore: story.quizScore,
    totalQuestions: story.totalQuestions,
    questionResponses: story.questionResponses,
    questionCorrections: story.questionCorrections,
    questions: story.questions,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  };
}

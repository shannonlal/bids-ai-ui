import mongoose, { Document, Schema } from 'mongoose';
import { Answer as AnswerType } from '../types/answer';

/**
 * Interface for the Answer document in MongoDB
 */
export interface IAnswerDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userEmail: string;
  storyId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  score: number;
  correction: string;
  suggestedAnswer: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mongoose schema definition for Answer
 */
const answerSchema = new Schema<IAnswerDocument>(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    storyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'french-idol.Story',
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correction: {
      type: String,
      required: true,
    },
    suggestedAnswer: {
      type: String,
      required: true,
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
    collection: 'Answer', // Explicitly set collection name
  }
);

// Model name for caching
const MODEL_NAME = 'french-idol.Answer';

// Create and export the model
// Using type assertion since the model might not exist yet in Next.js hot reloading
export const Answer =
  (mongoose.models[MODEL_NAME] as mongoose.Model<IAnswerDocument>) ||
  mongoose.model<IAnswerDocument>(MODEL_NAME, answerSchema);

// Utility function to transform MongoDB document to frontend type
export function mapAnswerToDTO(answer: IAnswerDocument): AnswerType {
  return {
    id: answer._id.toString(),
    userEmail: answer.userEmail,
    storyId: answer.storyId.toString(),
    question: answer.question,
    answer: answer.answer,
    score: answer.score,
    correction: answer.correction,
    suggestedAnswer: answer.suggestedAnswer,
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
  };
}

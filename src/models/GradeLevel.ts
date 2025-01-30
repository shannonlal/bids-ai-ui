import mongoose, { Document, Schema } from 'mongoose';
import { GradeLevel as GradeLevelType } from '../types/gradeLevel';

/**
 * Interface for the GradeLevel document in MongoDB
 */
export interface IGradeLevelDocument extends Document {
  _id: mongoose.Types.ObjectId;
  grade: number;
  levelName: string;
  averageAge: number;
  numberOfQuestions: number;
  instructions: string;
  storyWordCount: number;
}

/**
 * Mongoose schema definition for GradeLevel
 */
const gradeLevelSchema = new Schema<IGradeLevelDocument>(
  {
    grade: {
      type: Number,
      required: true,
    },
    levelName: {
      type: String,
      required: true,
      trim: true,
    },
    averageAge: {
      type: Number,
      required: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    storyWordCount: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'GradeLevel', // Explicitly set collection name
  }
);

// Model name for caching
const MODEL_NAME = 'french-idol.GradeLevel';

// Create and export the model
export const GradeLevel =
  (mongoose.models[MODEL_NAME] as mongoose.Model<IGradeLevelDocument>) ||
  mongoose.model<IGradeLevelDocument>(MODEL_NAME, gradeLevelSchema);

// Utility function to transform MongoDB document to frontend type
export function mapGradeLevelToDTO(gradeLevel: IGradeLevelDocument): GradeLevelType {
  return {
    id: gradeLevel._id.toString(),
    grade: gradeLevel.grade,
    levelName: gradeLevel.levelName,
    averageAge: gradeLevel.averageAge,
    numberOfQuestions: gradeLevel.numberOfQuestions,
    instructions: gradeLevel.instructions,
    storyWordCount: gradeLevel.storyWordCount,
  };
}

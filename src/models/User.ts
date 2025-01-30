import mongoose, { Document, Schema } from 'mongoose';
import { User as UserType } from '../types/user';

/**
 * Interface for the User document in MongoDB
 */
export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string; // Changed to string to match DB
  updatedAt: string; // Changed to string to match DB
}

/**
 * Mongoose schema definition for User
 */
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
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
    collection: 'User', // Explicitly set collection name
  }
);

// Model name for caching
const MODEL_NAME = 'french-idol.User';

// Create and export the model
// Using type assertion since the model might not exist yet in Next.js hot reloading
export const User =
  (mongoose.models[MODEL_NAME] as mongoose.Model<IUserDocument>) ||
  mongoose.model<IUserDocument>(MODEL_NAME, userSchema);

// Utility function to transform MongoDB document to frontend type
export function mapUserToDTO(user: IUserDocument): UserType {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt, // Already a string
    updatedAt: user.updatedAt, // Already a string
  };
}

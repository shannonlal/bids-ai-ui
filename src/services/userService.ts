import { User, mapUserToDTO } from '../models/User';
import connectDB from '../lib/mongodb';
import { User as UserType, CreateUserInput, UpdateUserInput } from '../types/user';
import bcrypt from 'bcryptjs';

/**
 * Service class for handling user-related operations
 */
export class UserService {
  /**
   * Retrieves a user by their email address
   * @param email - The email address to search for
   * @returns The user data transformed to frontend type
   * @throws Error if user is not found
   */
  async getUserByEmail(email: string): Promise<UserType> {
    await connectDB();
    const query = { email: email.toLowerCase() };
    console.log('Searching for user with query:', query);

    const user = await User.findOne(query);
    console.log('Raw user search result:', user);

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    return mapUserToDTO(user);
  }

  /**
   * Retrieves all users from the database
   * @returns Array of users transformed to frontend type
   */
  async getAllUsers(): Promise<UserType[]> {
    await connectDB();
    console.log('Fetching all users...');

    const users = await User.find({});
    console.log('Raw query result:', JSON.stringify(users, null, 2));
    console.log(`Found ${users.length} users`);

    return users.map(mapUserToDTO);
  }

  /**
   * Create a new user
   * @param userData - User creation input data
   * @returns Created user data
   */
  async createUser(userData: CreateUserInput): Promise<UserType> {
    await connectDB();

    // Check for existing user
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await newUser.save();
    return mapUserToDTO(newUser);
  }

  /**
   * Updates a user's profile information
   * @param email - The email of the user to update
   * @param updates - The fields to update (firstName and lastName)
   * @returns The updated user data transformed to frontend type
   * @throws Error if user is not found
   */
  async updateUser(email: string, updates: UpdateUserInput): Promise<UserType> {
    await connectDB();
    const query = { email: email.toLowerCase() };
    console.log('Updating user with query:', query);
    console.log('Updates:', updates);

    const user = await User.findOneAndUpdate(
      query,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }

    return mapUserToDTO(user);
  }

  /**
   * Deletes a user by email
   * @param email - User's email
   */
  async deleteUser(email: string): Promise<void> {
    await connectDB();
    const result = await User.deleteOne({
      email: email.toLowerCase(),
    });

    if (result.deletedCount === 0) {
      throw new Error(`User not found with email: ${email}`);
    }
  }

  /**
   * Resets a user's password
   * @param email - User's email
   * @param newPassword - New password
   */
  async resetPassword(email: string, newPassword: string): Promise<void> {
    await connectDB();

    // Password complexity check
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      }
    );

    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }
  }

  /**
   * Checks if a user exists with the given email
   * @param email - The email address to check
   * @returns True if user exists, false otherwise
   */
  async exists(email: string): Promise<boolean> {
    await connectDB();
    const query = { email: email.toLowerCase() };
    console.log('Checking user existence with query:', query);

    const user = await User.findOne(query);
    console.log('Raw existence check result:', user);

    return !!user;
  }
}

// Export a singleton instance
export const userService = new UserService();

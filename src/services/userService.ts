import { User, mapUserToDTO } from '../models/User';
import connectDB from '../lib/mongodb';
import { User as UserType } from '../types/user';

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

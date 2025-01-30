/**
 * Shared type representing a user in the frontend
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Type for creating a new user
 */
export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * API response type for getting a user
 */
export interface GetUserResponse {
  user: User;
}

/**
 * Type for updating a user's profile
 */
export interface UpdateUserInput {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * API response type for updating a user
 */
export interface UpdateUserResponse {
  user: User;
}

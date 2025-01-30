import { Story } from '../story';

/**
 * Query parameters for listing stories
 */
export interface ListStoriesQuery {
  email: string;
  read?: string; // boolean as string since query params are strings
}

/**
 * Response type for listing stories
 */
export interface ListStoriesResponse {
  stories: Story[];
}

import { NextApiRequest, NextApiResponse } from 'next';
import { storyService } from '../../../services/storyService';
import { ListStoriesResponse } from '../../../types/api/listStories';

/**
 * API endpoint to list stories for a user filtered by read status
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListStoriesResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, read } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate and convert read query param to boolean if provided
    let readStatus: boolean | undefined;
    if (read !== undefined) {
      if (read !== 'true' && read !== 'false') {
        return res.status(400).json({ error: 'Invalid read status value' });
      }
      readStatus = read === 'true';
    }

    const stories = await storyService.getUserStories(email, readStatus ?? false);

    return res.status(200).json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

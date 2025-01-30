import { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../services/userService';
import { User } from '../../../types/user';

/**
 * GET /api/users/list
 * Returns a list of all users in the system
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ users: User[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

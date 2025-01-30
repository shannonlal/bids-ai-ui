import { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../services/userService';
import { GetUserResponse } from '../../../types/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetUserResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.query.email;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const user = await userService.getUserByEmail(email);
    return res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(404).json({ error: message });
  }
}

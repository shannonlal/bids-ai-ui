import { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../services/userService';
import { UpdateUserResponse } from '../../../types/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateUserResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!firstName || typeof firstName !== 'string') {
    return res.status(400).json({ error: 'First name is required' });
  }

  if (!lastName || typeof lastName !== 'string') {
    return res.status(400).json({ error: 'Last name is required' });
  }

  try {
    const user = await userService.updateUser(email, { firstName, lastName });
    return res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(404).json({ error: message });
  }
}

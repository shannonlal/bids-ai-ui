import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate email parameter
  if (!id) {
    return res.status(400).json({ error: 'User email is required' });
  }

  const email = Array.isArray(id) ? id[0] : id;

  try {
    switch (req.method) {
      case 'GET':
        // Fetch individual user details
        const user = await userService.getUserByEmail(email);
        res.status(200).json({ user });
        break;

      case 'PUT':
        // Update user profile
        const updateData = req.body;
        const updatedUser = await userService.updateUser(email, updateData);
        res.status(200).json({ user: updatedUser });
        break;

      case 'DELETE':
        // Remove user account
        await userService.deleteUser(email);
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('User Management API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

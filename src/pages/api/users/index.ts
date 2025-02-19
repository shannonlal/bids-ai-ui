import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../services/userService';
import { CreateUserInput } from '../../../types/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        // User creation
        const createData: CreateUserInput = req.body;
        const newUser = await userService.createUser(createData);
        res.status(201).json({ user: newUser });
        break;

      case 'GET':
        // List all users (with potential pagination)
        const users = await userService.getAllUsers();
        res.status(200).json({ users });
        break;

      default:
        res.setHeader('Allow', 'GET, POST');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('User API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

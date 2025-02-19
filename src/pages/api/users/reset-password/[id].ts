import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../../services/userService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Validate email parameter
  if (!id) {
    return res.status(400).json({ error: 'User email is required' });
  }

  const email = Array.isArray(id) ? id[0] : id;

  try {
    switch (req.method) {
      case 'POST':
        // Password reset functionality
        const { newPassword } = req.body;

        // Validate new password
        if (!newPassword) {
          return res.status(400).json({ error: 'New password is required' });
        }

        // Reset password
        await userService.resetPassword(email, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
        break;

      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Password Reset API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

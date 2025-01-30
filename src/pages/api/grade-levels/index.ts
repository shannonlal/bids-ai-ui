import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import { GradeLevel, mapGradeLevelToDTO } from '../../../models/GradeLevel';
import { GradeLevelsResponse } from '../../../types/gradeLevel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GradeLevelsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const gradeLevels = await GradeLevel.find({});

    return res.status(200).json({
      gradeLevels: gradeLevels.map(mapGradeLevelToDTO),
    });
  } catch (error) {
    console.error('Error fetching grade levels:', error);
    return res.status(500).json({ error: 'Failed to fetch grade levels' });
  }
}

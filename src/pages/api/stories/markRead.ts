import { NextApiRequest, NextApiResponse } from 'next';
import { storyService } from '../../../services/storyService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      email,
      storyId,
      quizScore,
      totalQuestions,
      questions,
      questionResponses,
      questionCorrections,
    } = req.body;

    if (!email || !storyId || typeof quizScore !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedStory = await storyService.markStoryRead(
      email,
      storyId,
      quizScore,
      totalQuestions,
      questions,
      questionResponses,
      questionCorrections
    );
    res.status(200).json(updatedStory);
  } catch (error) {
    console.error('Error marking story as read:', error);
    res.status(500).json({ message: 'Error marking story as read' });
  }
}

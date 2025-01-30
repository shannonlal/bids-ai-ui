import { NextApiRequest, NextApiResponse } from 'next';
import { answerService } from '../../../services/answerService';
import { GetStoryAnswersResponse, GetStoryAnswersError } from '../../../types/api/getStoryAnswers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetStoryAnswersResponse | GetStoryAnswersError>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { storyId, email } = req.query;

    if (!storyId || typeof storyId !== 'string') {
      return res.status(400).json({ message: 'Story ID is required' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    const answers = await answerService.getUserAnswersForStory(email, storyId);

    if (answers.length === 0) {
      return res.status(404).json({ message: 'No answers found for this story' });
    }

    res.status(200).json({
      answers: answers.map(answer => ({
        id: answer.id,
        question: answer.question,
        answer: answer.answer,
        score: answer.score,
        correction: answer.correction,
      })),
    });
  } catch (error) {
    console.error('Error fetching story answers:', error);
    res.status(500).json({ message: 'Error fetching story answers' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { Story } from '../../../models/Story';
import connectDB from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    await connectDB();

    const stories = await Story.find({
      userEmail: email.toLowerCase(),
      read: true,
    });

    res.status(200).json({
      stories: stories.map(story => ({
        id: story._id.toString(),
        userEmail: story.userEmail,
        sourceText: story.sourceText,
        title: story.title,
        article: story.article,
        read: story.read,
        quizScore: story.quizScore,
        totalQuestions: story.totalQuestions,
        questions: story.questions,
        questionResponses: story.questionResponses,
        questionCorrections: story.questionCorrections,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching read stories:', error);
    res.status(500).json({ message: 'Error fetching read stories' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GenerateStoryApiResponse } from '../../types/api/generateStory';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateStoryApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      },
    });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Text field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative story generator. Generate an engaging story based on the provided text.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const story = completion.choices[0]?.message?.content;

    if (!story) {
      return res.status(500).json({
        error: {
          message: 'Failed to generate story',
          code: 'GENERATION_FAILED',
        },
      });
    }

    return res.status(200).json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({
      error: {
        message: 'Failed to generate story',
        code: 'OPENAI_ERROR',
      },
    });
  }
}

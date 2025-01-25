import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GenerateQuestionsApiResponse } from '../../types/api/generateQuestions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const GENERATE_QUESTIONS_SYSTEM_PROMPT = `You are a French language teacher creating quiz questions for 10-year-old students. Your task is to generate 3-5 questions based on the provided story.

IMPORTANT:
1. Questions must be in French
2. Questions must be based on information present in the story
3. Questions should be appropriate for a 10-year-old's comprehension level
4. Questions should test understanding of the story content
5. Questions should vary in difficulty

Output format:
{
  "questions": [
    "Question 1 in French",
    "Question 2 in French",
    "Question 3 in French"
  ]
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateQuestionsApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      },
    });
  }

  const { story } = req.body;

  if (!story || typeof story !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Story field is required and must be a string',
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
          content: GENERATE_QUESTIONS_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: story,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return res.status(500).json({
        error: {
          message: 'Failed to generate questions',
          code: 'GENERATION_FAILED',
        },
      });
    }

    try {
      const parsedResponse = JSON.parse(response);
      if (!Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response format');
      }

      return res.status(200).json({ questions: parsedResponse.questions });
    } catch (parseError) {
      return res.status(500).json({
        error: {
          message: 'Failed to parse generated questions',
          code: 'PARSE_ERROR',
        },
      });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      error: {
        message: 'Failed to generate questions',
        code: 'OPENAI_ERROR',
      },
    });
  }
}

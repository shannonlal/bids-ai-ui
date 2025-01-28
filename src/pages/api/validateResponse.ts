import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { ValidateResponseApiResponse } from '../../types/api/validateResponse';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const VALIDATE_RESPONSE_SYSTEM_PROMPT = `You are responsible for validating a response from a 10 year old student who is asking questions about the following article:

{article}

The student was asked the following question:
{question}

Please grade their response:
{response}

Grading criteria:
1.5 points for accuracy
1.5 points for writing a complete sentence
2 points for grammar

Here are key points for grammar:
1. The sentences must have a period at the end
2. Must start with a capital letter and have Capital letters for proper nouns
3. Must have proper accented characters for French

Provide your response in the following JSON format:
{
  "score": (number between 0 and 5),
  "correction": "(detailed explanation in French of the grade, including what was done well and what could be improved. Even for perfect scores, provide encouraging feedback.  No more than 30 words)"
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidateResponseApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      },
    });
  }

  const { story, question, response } = req.body;

  if (!story || typeof story !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Story field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Question field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  if (!response || typeof response !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Response field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  try {
    const prompt = VALIDATE_RESPONSE_SYSTEM_PROMPT.replace('{article}', story)
      .replace('{question}', question)
      .replace('{response}', response);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        error: {
          message: 'Failed to validate response',
          code: 'VALIDATION_FAILED',
        },
      });
    }

    try {
      console.log('Parsing response:', aiResponse);
      const parsedResponse = JSON.parse(aiResponse);

      if (
        typeof parsedResponse.score !== 'number' ||
        typeof parsedResponse.correction !== 'string' ||
        parsedResponse.score < 0 ||
        parsedResponse.score > 5
      ) {
        return res.status(500).json({
          error: {
            message: 'Invalid response format from validation',
            code: 'INVALID_RESPONSE_FORMAT',
          },
        });
      }

      return res.status(200).json({
        score: parsedResponse.score,
        correction: parsedResponse.correction,
      });
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({
        error: {
          message: 'Failed to parse validation response',
          code: 'PARSE_ERROR',
        },
      });
    }
  } catch (error) {
    console.error('Error validating response:', error);
    return res.status(500).json({
      error: {
        message: 'Failed to validate response',
        code: 'OPENAI_ERROR',
      },
    });
  }
}

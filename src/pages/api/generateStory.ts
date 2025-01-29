import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GenerateStoryApiResponse } from '../../types/api/generateStory';
import promptExamples from './generateStoryPrompt.json';
import { storyService } from '../../services/storyService';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const buildSystemPrompt = () => {
  const basePrompt = `You are a french children news author. Your task is to generate short articles base on given text.
The following are examples of text that are appropriate for children.
Examples:
`;

  const examples = promptExamples.articles
    .map(
      article => `Title: ${article.title}
Content: ${article.content}
`
    )
    .join('\n');

  return `${basePrompt}${examples}

  Output:
  {
    "title":"Article title.  Should be less than 10 words",
    "article":"Article content.  Should be less than 300 words"
  }
IMPORTANT:
1. The articles must be written in french
2. The articles must be appropriate for children aged 10 years old
3. The articles should not have any inappropriate content or language for children
4. Even if the text is provided in English, the articles must be written in French and must be appropriate for children aged 10 years old
5. Article content should be less than 300 words
`;
};

const GENERATE_STORY_SYSTEM_PROMPT = buildSystemPrompt();

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

  const { text, email } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Text field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      error: {
        message: 'Email field is required and must be a string',
        code: 'INVALID_INPUT',
      },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: GENERATE_STORY_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const storyContent = completion.choices[0]?.message?.content;

    console.log('Generated story:', storyContent);

    if (!storyContent) {
      return res.status(500).json({
        error: {
          message: 'Failed to generate story',
          code: 'GENERATION_FAILED',
        },
      });
    }

    try {
      const parsedStory = JSON.parse(storyContent);
      const savedStory = await storyService.saveStory(
        email,
        parsedStory.title,
        text,
        parsedStory.article
      );
      return res.status(200).json({ story: savedStory });
    } catch (parseError) {
      console.error('Error parsing story:', parseError);
      return res.status(500).json({
        error: {
          message: 'Failed to parse generated story',
          code: 'PARSE_ERROR',
        },
      });
    }
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

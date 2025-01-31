import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import {
  ValidateResponseApiResponse,
  ValidationInput,
  StudentEvaluation,
  TeacherReview,
} from '../../types/api/validateResponse';
import { answerService } from '../../services/answerService';
import {
  VALIDATE_RESPONSE_SYSTEM_PROMPT,
  REVIEW_RESPONSE_SYSTEM_PROMPT,
} from '../../constants/prompts';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface ValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    code: string;
    status: number;
  };
  data?: ValidationInput;
}

// const ERROR_CODES = {
//   VALIDATION_FAILED: {
//     status: 500,
//     code: 'VALIDATION_FAILED',
//   },
//   PARSE_ERROR: {
//     status: 500,
//     code: 'PARSE_ERROR',
//   },
//   DATABASE_ERROR: {
//     status: 500,
//     code: 'DATABASE_ERROR',
//   },
//   OPENAI_ERROR: {
//     status: 500,
//     code: 'OPENAI_ERROR',
//   },
//   INVALID_RESPONSE_FORMAT: {
//     status: 500,
//     code: 'INVALID_RESPONSE_FORMAT',
//   },
// } as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateInputs = (body: any): ValidationResult => {
  const { story, question, response, userEmail, storyId } = body;

  if (!story || typeof story !== 'string') {
    return {
      isValid: false,
      error: {
        message: 'Story field is required and must be a string',
        code: 'INVALID_INPUT',
        status: 400,
      },
    };
  }

  if (!question || typeof question !== 'string') {
    return {
      isValid: false,
      error: {
        message: 'Question field is required and must be a string',
        code: 'INVALID_INPUT',
        status: 400,
      },
    };
  }

  if (!response || typeof response !== 'string') {
    return {
      isValid: false,
      error: {
        message: 'Response field is required and must be a string',
        code: 'INVALID_INPUT',
        status: 400,
      },
    };
  }

  if (!userEmail || typeof userEmail !== 'string') {
    return {
      isValid: false,
      error: {
        message: 'User email is required and must be a string',
        code: 'INVALID_INPUT',
        status: 400,
      },
    };
  }

  if (!storyId || typeof storyId !== 'string') {
    return {
      isValid: false,
      error: {
        message: 'Story ID is required and must be a string',
        code: 'INVALID_INPUT',
        status: 400,
      },
    };
  }

  return {
    isValid: true,
    data: { story, question, response, userEmail, storyId },
  };
};

const evaluateStudentResponse = async (input: ValidationInput): Promise<StudentEvaluation> => {
  const prompt = VALIDATE_RESPONSE_SYSTEM_PROMPT.replace('{article}', input.story)
    .replace('{question}', input.question)
    .replace('{response}', input.response);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 250,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Failed to validate response');
    }

    const parsedResponse = JSON.parse(aiResponse);

    if (
      typeof parsedResponse.score !== 'number' ||
      typeof parsedResponse.correction !== 'string' ||
      typeof parsedResponse.suggestedAnswer !== 'string' ||
      parsedResponse.score < 0 ||
      parsedResponse.score > 5
    ) {
      throw new Error('Invalid response format from validation');
    }

    return {
      score: parsedResponse.score,
      correction: parsedResponse.correction,
      suggestedAnswer: parsedResponse.suggestedAnswer,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse validation response');
    }
    throw error;
  }
};

const evaluateTeacherResponse = async (
  input: ValidationInput,
  studentEvaluation: StudentEvaluation
): Promise<TeacherReview> => {
  const prompt = REVIEW_RESPONSE_SYSTEM_PROMPT.replace('{story}', input.story)
    .replace('{question}', input.question)
    .replace('{response}', input.response)
    .replace('{score}', studentEvaluation.score.toString())
    .replace('{correction}', studentEvaluation.correction)
    .replace('{suggestedAnswer}', studentEvaluation.suggestedAnswer);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 250,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Failed to review evaluation');
    }

    const parsedResponse = JSON.parse(aiResponse);

    if (
      typeof parsedResponse.isScoreAccurate !== 'boolean' ||
      typeof parsedResponse.finalScore !== 'number' ||
      typeof parsedResponse.finalCorrection !== 'string' ||
      typeof parsedResponse.reviewComments !== 'string' ||
      parsedResponse.finalScore < 0 ||
      parsedResponse.finalScore > 5
    ) {
      throw new Error('Invalid response format from review');
    }

    return {
      isScoreAccurate: parsedResponse.isScoreAccurate,
      finalScore: parsedResponse.finalScore,
      finalCorrection: parsedResponse.finalCorrection,
      reviewComments: parsedResponse.reviewComments,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse review response');
    }
    throw error;
  }
};

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

  // Validate inputs first
  const validationResult = validateInputs(req.body);
  if (!validationResult.isValid) {
    const { status, message, code } = validationResult.error!;
    return res.status(status).json({
      error: { message, code },
    });
  }

  try {
    // Get initial evaluation
    const studentEvaluation = await evaluateStudentResponse(validationResult.data!);

    // Get teacher review
    const teacherReview = await evaluateTeacherResponse(validationResult.data!, studentEvaluation);

    // Save final results
    try {
      const savedAnswer = await answerService.saveAnswer(
        validationResult.data!.userEmail,
        validationResult.data!.storyId,
        validationResult.data!.question,
        validationResult.data!.response,
        teacherReview.finalScore,
        teacherReview.finalCorrection,
        studentEvaluation.suggestedAnswer
      );

      return res.status(200).json({
        score: teacherReview.finalScore,
        correction: teacherReview.finalCorrection,
        suggestedAnswer: studentEvaluation.suggestedAnswer,
        reviewComments: teacherReview.reviewComments,
        savedAnswer,
      });
    } catch (dbError) {
      return res.status(500).json({
        error: {
          message: 'Failed to save answer to database',
          code: 'DATABASE_ERROR',
        },
      });
    }
  } catch (error) {
    console.error('Error in validate response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    if (errorMessage.includes('Failed to parse')) {
      return res.status(500).json({
        error: {
          message: 'Failed to parse validation response',
          code: 'PARSE_ERROR',
        },
      });
    }

    if (errorMessage.includes('Invalid response format')) {
      return res.status(500).json({
        error: {
          message: 'Invalid response format from validation',
          code: 'INVALID_RESPONSE_FORMAT',
        },
      });
    }

    return res.status(500).json({
      error: {
        message: 'Failed to validate response',
        code: 'OPENAI_ERROR',
      },
    });
  }
}

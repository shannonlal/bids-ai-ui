import React from 'react';
import { Story, QuizResultData } from '../../types/story';
import { QuizResults } from '../french-idol/quiz/QuizResults';

interface StoryQuizModalProps {
  story: Story;
  onClose: () => void;
  answers?: QuizResultData[];
}

export const StoryQuizModal: React.FC<StoryQuizModalProps> = ({ story, onClose, answers }) => {
  console.log('StoryQuizModal received story:', story);

  // If answers are provided directly, use them
  if (answers) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" data-testid="modal-title">
              {story.title}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <QuizResults results={answers} />
        </div>
      </div>
    );
  }

  // Fallback to using story data for backward compatibility
  if (!story.questions || !story.questionResponses || !story.questionCorrections) {
    console.log('Missing required story data:', {
      hasQuestions: !!story.questions,
      hasResponses: !!story.questionResponses,
      hasCorrections: !!story.questionCorrections,
    });
    return null;
  }

  const results = story.questions.map((question, index) => ({
    question,
    response: story.questionResponses![index],
    correction: story.questionCorrections![index],
    score: story.quizScore! / story.totalQuestions!, // Approximate individual scores
    suggestedAnswer: story.suggestedAnswers?.[index] || 'No suggested answer available',
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" data-testid="modal-title">
            {story.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <QuizResults results={results} />
      </div>
    </div>
  );
};

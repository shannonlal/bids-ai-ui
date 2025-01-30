import React from 'react';
import { Story } from '../../types/story';
import { QuizResults } from '../french-idol/quiz/QuizResults';

interface StoryQuizModalProps {
  story: Story;
  onClose: () => void;
}

export const StoryQuizModal: React.FC<StoryQuizModalProps> = ({ story, onClose }) => {
  if (!story.questions || !story.questionResponses || !story.questionCorrections) {
    return null;
  }

  const results = story.questions.map((question, index) => ({
    question,
    response: story.questionResponses![index],
    correction: story.questionCorrections![index],
    score: story.quizScore! / story.totalQuestions!, // Approximate individual scores
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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

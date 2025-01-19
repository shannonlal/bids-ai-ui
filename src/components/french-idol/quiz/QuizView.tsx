import React from 'react';
import { useQuiz } from './QuizContext';
import { Button } from '../../../ui-kit/Button';
import { useFrenchIdol } from '../FrenchIdolContext';
import { QuizStory } from './QuizStory';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

export const QuizView: React.FC = () => {
  const {
    currentQuestion,
    score,
    questions,
    hasMoreQuestions,
    markQuestionAnswered,
    answeredQuestions,
    questionScores,
  } = useQuiz();
  const { setDisplayStoryUpload } = useFrenchIdol();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">French Idol Quiz</h1>
        <p className="text-gray-600 mb-4">
          Welcome to the French Idol Quiz! Test your knowledge and improve your French language
          skills.
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="ml-2">({answeredQuestions.length} answered)</span>
          </div>
          <span>Score: {score}</span>
        </div>
        <div className="mt-6 mb-6">
          <QuizStory />
        </div>
        {questions.length > 0 && (
          <div className="mt-6 mb-6">
            {hasMoreQuestions() ? (
              <QuizQuestion
                question={questions[currentQuestion]}
                questionIndex={currentQuestion}
                onAnswered={markQuestionAnswered}
              />
            ) : (
              <div className="space-y-6">
                <QuizResults
                  results={questions.map((question, index) => ({
                    question,
                    score: questionScores[index] || 0,
                  }))}
                />
                <div className="text-center">
                  <Button onClick={() => setDisplayStoryUpload(true)}>Start Again</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

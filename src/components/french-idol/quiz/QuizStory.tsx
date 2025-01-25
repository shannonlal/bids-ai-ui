import React, { useEffect } from 'react';
import { TextArea } from '../../../ui-kit/TextArea';
import { useQuiz } from './QuizContext';
import { determineQuestions } from '../../../hooks/useDetermineQuestions';

export const QuizStory: React.FC = () => {
  const { storyText, setStoryText, setQuestions } = useQuiz();

  useEffect(() => {
    const loadQuestions = async () => {
      if (storyText.trim()) {
        const questions = await determineQuestions(storyText);
        setQuestions(questions);
      } else {
        setQuestions([]);
      }
    };

    loadQuestions();
  }, [storyText, setQuestions]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoryText(e.target.value);
  };

  return (
    <div className="w-full h-96">
      <TextArea
        value={storyText}
        onChange={handleTextChange}
        placeholder="Enter your story here..."
        className="h-full"
      />
    </div>
  );
};

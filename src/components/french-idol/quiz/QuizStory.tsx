import React from 'react';
import { TextArea } from '../../../ui-kit/TextArea';
import { useQuiz } from './QuizContext';

export const QuizStory: React.FC = () => {
  const { storyText, setStoryText } = useQuiz();

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

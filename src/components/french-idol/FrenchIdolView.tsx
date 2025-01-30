import { useState } from 'react';
import { useFrenchIdol } from './FrenchIdolContext';
import { Story } from '../../types/story';
import { QuizView } from './quiz/QuizView';
import { QuizProvider } from './quiz/QuizContext';
import { StoryList } from '../story/StoryList';

export function FrenchIdolView() {
  const { storyText, stories, currentUser, setDisplayStoryUpload, setStoryText } = useFrenchIdol();

  const [selectedStoryId, setSelectedStoryId] = useState<string>('');

  const handleStorySelect = (story: Story) => {
    setStoryText(story.article);
    setSelectedStoryId(story.id);
    setDisplayStoryUpload(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">French Idol Practice</h1>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Your Stories</h2>
        {storyText ? (
          <QuizProvider
            initialStoryText={storyText}
            initialUserEmail={currentUser?.email || ''}
            initialStoryId={selectedStoryId}
          >
            <QuizView />
          </QuizProvider>
        ) : (
          <StoryList stories={stories} onStorySelect={handleStorySelect} />
        )}
      </div>
    </div>
  );
}

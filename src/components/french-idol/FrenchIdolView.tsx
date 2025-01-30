import { useFrenchIdol } from './FrenchIdolContext';
import { Story } from '../../types/story';
import { StoryUpload } from './StoryUpload';
import { QuizView } from './quiz/QuizView';
import { QuizProvider } from './quiz/QuizContext';
import { StoryInput } from '../story/StoryInput';
import { StoryList } from '../story/StoryList';

export function FrenchIdolView() {
  const { displayStoryUpload, storyText, stories, setDisplayStoryUpload, setStoryText } =
    useFrenchIdol();

  const handleStorySelect = (story: Story) => {
    setStoryText(story.article);
    setDisplayStoryUpload(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">French Idol Practice</h1>
      <div className="max-w-4xl mx-auto">
        {displayStoryUpload ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
                <StoryUpload />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Paste Text</h2>
                <StoryInput />
              </div>
            </div>
            <StoryList stories={stories} onStorySelect={handleStorySelect} />
          </>
        ) : (
          <QuizProvider initialStoryText={storyText}>
            <QuizView />
          </QuizProvider>
        )}
      </div>
    </div>
  );
}

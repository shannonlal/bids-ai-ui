import { useFrenchIdol } from './FrenchIdolContext';
import { StoryUpload } from './StoryUpload';
import { QuizView } from './quiz/QuizView';
import { QuizProvider } from './quiz/QuizContext';

export function FrenchIdolView() {
  const { displayStoryUpload, storyText } = useFrenchIdol();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">French Idol Practice</h1>
      <div className="max-w-2xl mx-auto">
        {displayStoryUpload ? (
          <StoryUpload />
        ) : (
          <QuizProvider initialStoryText={storyText}>
            <QuizView />
          </QuizProvider>
        )}
      </div>
    </div>
  );
}

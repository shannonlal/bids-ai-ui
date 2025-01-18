import { useFrenchIdol } from './FrenchIdolContext';
import { StoryUpload } from './StoryUpload';

export function FrenchIdolView() {
  const { displayStoryUpload } = useFrenchIdol();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">French Idol Practice</h1>
      <div className="max-w-2xl mx-auto">
        {displayStoryUpload ? (
          <StoryUpload />
        ) : (
          <div className="text-center text-gray-600">Loading...</div>
        )}
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import { useFrenchIdol } from './FrenchIdolContext';
import { StoryUpload } from './StoryUpload';
import { StoryInput } from '../story/StoryInput';

export function CreateStoryView() {
  const router = useRouter();
  const { resetForm } = useFrenchIdol();

  const handleStoryCreated = () => {
    resetForm();
    router.push('/french-idol');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create French Story</h1>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
            <StoryUpload onSuccess={handleStoryCreated} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Paste Text</h2>
            <StoryInput onSuccess={handleStoryCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}

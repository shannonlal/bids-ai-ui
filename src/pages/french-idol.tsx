import { StoryUpload } from '../components/french-idol/StoryUpload';
import { FrenchIdolProvider } from '../components/french-idol/FrenchIdolContext';

export default function FrenchIdol() {
  return (
    <FrenchIdolProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">French Idol</h1>
          <StoryUpload />
        </div>
      </div>
    </FrenchIdolProvider>
  );
}

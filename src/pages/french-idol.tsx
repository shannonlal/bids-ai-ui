import { StoryUpload } from '../components/french-idol/StoryUpload';

export default function FrenchIdol() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">French Idol</h1>
        <StoryUpload />
      </div>
    </div>
  );
}

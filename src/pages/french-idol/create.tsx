import { FrenchIdolProvider } from '../../components/french-idol/FrenchIdolContext';
import { CreateStoryView } from '../../components/french-idol/CreateStoryView';

export default function CreateFrenchStory() {
  return (
    <FrenchIdolProvider>
      <div className="min-h-screen bg-gray-50">
        <CreateStoryView />
      </div>
    </FrenchIdolProvider>
  );
}

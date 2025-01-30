import { FrenchIdolProvider } from '../../components/french-idol/FrenchIdolContext';
import { FrenchIdolView } from '../../components/french-idol/FrenchIdolView';

export default function FrenchIdol() {
  return (
    <FrenchIdolProvider>
      <div className="min-h-screen bg-gray-50">
        <FrenchIdolView />
      </div>
    </FrenchIdolProvider>
  );
}

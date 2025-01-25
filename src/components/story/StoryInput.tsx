import { useState } from 'react';
import { TextArea } from '../../ui-kit/TextArea';
import { Button } from '../../ui-kit/Button';
import { useFrenchIdol } from '../french-idol/FrenchIdolContext';

export const StoryInput = () => {
  const { setStoryText, setDisplayStoryUpload, setInputMethod } = useFrenchIdol();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <TextArea
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder="Paste your story text here..."
          className="min-h-[200px]"
          error={!!error}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          onClick={async () => {
            if (!text.trim()) {
              setError('Please enter some text');
              return;
            }
            setError('');
            setIsLoading(true);
            try {
              setStoryText(text);
              setInputMethod('text');
              setDisplayStoryUpload(false);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Start Practice'}
        </Button>
      </div>
    </div>
  );
};

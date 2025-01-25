import { useState } from 'react';
import { TextArea } from '../../ui-kit/TextArea';
import { Button } from '../../ui-kit/Button';
import { useFrenchIdol } from '../french-idol/FrenchIdolContext';
import { GenerateStoryApiResponse } from '../../types/api/generateStory';

const escapeText = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

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
              const response = await fetch('/api/generateStory', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: escapeText(text) }),
              });

              const data: GenerateStoryApiResponse = await response.json();

              if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to generate story');
              }

              if (data.story) {
                try {
                  const storyObj = JSON.parse(data.story);
                  setStoryText(storyObj.article);
                } catch (e) {
                  setStoryText(data.story);
                }
                setInputMethod('text');
                setDisplayStoryUpload(false);
              }
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to generate story');
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

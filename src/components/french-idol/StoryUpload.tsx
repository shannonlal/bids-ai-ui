import { useState, useRef, ChangeEvent } from 'react';
import { useFrenchIdol } from './FrenchIdolContext';
import { Button } from '../../ui-kit/Button';
import { IconDownload } from '../../ui-kit/icons/IconDownload';
import { cn } from '../../ui-kit/utils/cn';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export function StoryUpload() {
  const { displayStoryUpload, setDisplayStoryUpload, setStoryText } = useFrenchIdol();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError('');

    if (!selectedFile) {
      return;
    }

    // Validate file type
    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadClick = () => {
    // For testing: Create a mock PDF file
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    setFile(mockFile);
  };

  if (!displayStoryUpload) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 mb-4 cursor-pointer',
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          )}
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center">
            <IconDownload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              {file ? file.name : 'Upload your French PDF story'}
            </p>
            <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <Button
          onClick={async () => {
            try {
              // For now, we'll use a placeholder text until PDF processing is implemented
              setStoryText('Sample story text from uploaded PDF');
              setDisplayStoryUpload(false);
            } catch (error) {
              console.error('Error processing file:', error);
              setError('Error processing file');
            }
          }}
          disabled={!file}
        >
          Start Practice
        </Button>
      </div>
    </div>
  );
}

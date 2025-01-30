import { useState, useRef, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import { useFrenchIdol } from './FrenchIdolContext';
import { Button } from '../../ui-kit/Button';
import { IconDownload } from '../../ui-kit/icons/IconDownload';
import { cn } from '../../ui-kit/utils/cn';

interface PDFParserChildrenProps {
  parsePdf: (file: File) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

interface PDFParserProps {
  children: (props: PDFParserChildrenProps) => React.ReactElement;
}

// Import PDF parser hook dynamically with SSR disabled
const DynamicPDFParser = dynamic(
  () =>
    import('../../hooks/usePdfParser').then(mod => {
      const { usePdfParser } = mod;
      return function PDFParserWrapper(props: PDFParserProps) {
        const { parsePdf, isLoading, error } = usePdfParser();
        return props.children({ parsePdf, isLoading, error });
      };
    }),
  { ssr: false }
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface StoryUploadProps {
  onSuccess?: () => void;
}

export function StoryUpload({ onSuccess }: StoryUploadProps) {
  const { setDisplayStoryUpload, setStoryText, setInputMethod } = useFrenchIdol();
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
    fileInputRef.current?.click();
  };

  return (
    <DynamicPDFParser>
      {({ parsePdf, isLoading, error: parseError }) => (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              data-testid="file-input"
            />
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 mb-4 cursor-pointer',
                error || parseError
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
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

            {(error || parseError) && (
              <div className="text-red-500 text-sm mb-4">{error || parseError}</div>
            )}

            <Button
              onClick={async () => {
                if (!file) return;
                try {
                  const parsedText = await parsePdf(file);
                  setStoryText(parsedText);
                  setInputMethod('upload');
                  setDisplayStoryUpload(false);
                  onSuccess?.();
                } catch (err) {
                  console.error('Error processing file:', err);
                  setError('Error processing PDF file');
                }
              }}
              disabled={!file || isLoading}
            >
              {isLoading ? 'Processing...' : 'Start Practice'}
            </Button>
          </div>
        </div>
      )}
    </DynamicPDFParser>
  );
}

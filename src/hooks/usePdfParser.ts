import { useState } from 'react';
import pdfToText from 'react-pdftotext';

export function usePdfParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsePdf = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const text = await pdfToText(file);
      const formattedText = text
        .split(/\n\s*\n/)
        .map(chunk => chunk.trim())
        .filter(chunk => chunk.length > 0)
        .join('\n\n');
      return formattedText;
    } catch (err) {
      setError('Failed to parse PDF');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { parsePdf, isLoading, error };
}

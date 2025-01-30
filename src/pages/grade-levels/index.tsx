import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { GradeLevelsTable } from '../../components/grade-levels/GradeLevelsTable';
import { GradeLevel } from '../../types/gradeLevel';

const GradeLevelsPage: React.FC = () => {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGradeLevels = async () => {
      try {
        const response = await fetch('/api/grade-levels');
        if (!response.ok) {
          throw new Error('Failed to fetch grade levels');
        }
        const data = await response.json();
        setGradeLevels(data.gradeLevels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGradeLevels();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Grade Levels</h1>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && gradeLevels.length === 0 && (
          <div className="text-center text-gray-500 py-8">No grade levels found.</div>
        )}

        {!isLoading && !error && gradeLevels.length > 0 && (
          <GradeLevelsTable gradeLevels={gradeLevels} />
        )}
      </div>
    </Layout>
  );
};

export default GradeLevelsPage;

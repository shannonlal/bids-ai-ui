import React, { useEffect, useState } from 'react';
import { Story } from '../../types/story';
import { StoryQuizModal } from './StoryQuizModal';

interface ResultsComponentProps {
  email: string;
}

export const ResultsComponent: React.FC<ResultsComponentProps> = ({ email }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(
          `/api/stories/getReadStories?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch stories');
        }

        setStories(data.stories);
        setError(null);
      } catch (error) {
        console.error('Error fetching stories:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [email]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Completed Stories</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stories.map(story => (
              <tr key={story.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {story.title}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  data-testid="story-score"
                >
                  {story.quizScore} / {story.totalQuestions}(
                  {Math.round((story.quizScore! / story.totalQuestions!) * 100)}%)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {story.totalQuestions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(story.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      console.log('View Results clicked for story:', story);
                      setSelectedStory(story);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Results
                  </button>
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No completed stories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStory &&
        (() => {
          console.log('Rendering modal for story:', selectedStory);
          return <StoryQuizModal story={selectedStory} onClose={() => setSelectedStory(null)} />;
        })()}
    </div>
  );
};

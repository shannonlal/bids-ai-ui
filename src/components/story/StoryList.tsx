import React from 'react';
import { Story } from '../../types/story';

interface StoryListProps {
  stories: Story[];
  onStorySelect: (story: Story) => void;
}

export function StoryList({ stories, onStorySelect }: StoryListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Unread Stories</h2>
      <div className="space-y-4">
        {stories.map(story => (
          <div
            key={story.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <h3 className="text-lg font-medium">{story.title}</h3>
            <button
              onClick={() => onStorySelect(story)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Read
            </button>
          </div>
        ))}
        {stories.length === 0 && (
          <p className="text-gray-500 text-center">No unread stories available</p>
        )}
      </div>
    </div>
  );
}

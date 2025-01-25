export const determineQuestions = async (storyText: string): Promise<string[]> => {
  const response = await fetch('/api/generateQuestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ story: storyText }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'Failed to generate questions');
  }

  return data.questions;
};

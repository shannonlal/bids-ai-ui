export const determineQuestions = async (_storyText: string): Promise<string[]> => {
  // Generate random number between 2-5 to ensure more variance
  const numQuestions = Math.floor(Math.random() * 4) + 2;

  // Placeholder questions
  const placeholderQuestions = [
    'What happened in the story?',
    'Who was the main character?',
    'Where did the story take place?',
    'What was the main conflict?',
    'How did the story end?',
  ];

  // Return random subset of questions based on numQuestions
  return new Promise(resolve => {
    const questions = placeholderQuestions.slice(0, numQuestions);
    resolve(questions);
  });
};

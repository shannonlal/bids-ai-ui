export const useDetermineQuestions = async (_storyText: string): Promise<string[]> => {
  // Generate random number between 1-5
  const numQuestions = Math.floor(Math.random() * 5) + 1;

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

import React from 'react';

interface QuizResult {
  question: string;
  score: number;
  response: string;
  correction: string;
}

interface QuizResultsProps {
  results: QuizResult[];
}

export const QuizResults: React.FC<QuizResultsProps> = ({ results }) => {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxPossibleScore = results.length * 5; // Assuming max score per question is 5

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Quiz Results</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Response
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                  {result.question}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">
                  {result.response}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.score}/5
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900 italic">
                  {result.correction}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Score
              </td>
              <td colSpan={2}></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {totalScore}/{maxPossibleScore}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

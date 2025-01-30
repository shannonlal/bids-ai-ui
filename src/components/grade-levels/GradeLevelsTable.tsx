import React, { useState } from 'react';
import { GradeLevel } from '../../types/gradeLevel';

interface GradeLevelsTableProps {
  gradeLevels: GradeLevel[];
}

type SortField = keyof Pick<
  GradeLevel,
  'grade' | 'levelName' | 'averageAge' | 'instructions' | 'storyWordCount'
>;

export const GradeLevelsTable: React.FC<GradeLevelsTableProps> = ({ gradeLevels }) => {
  const [sortField, setSortField] = useState<SortField>('grade');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedGradeLevels = [...gradeLevels].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              onClick={() => handleSort('grade')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Grade {renderSortIcon('grade')}
            </th>
            <th
              onClick={() => handleSort('levelName')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Level Name {renderSortIcon('levelName')}
            </th>
            <th
              onClick={() => handleSort('averageAge')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Average Age {renderSortIcon('averageAge')}
            </th>
            <th
              onClick={() => handleSort('instructions')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Instructions {renderSortIcon('instructions')}
            </th>
            <th
              onClick={() => handleSort('storyWordCount')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Word Count {renderSortIcon('storyWordCount')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedGradeLevels.map(level => (
            <tr key={level.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{level.grade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {level.levelName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {level.averageAge}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{level.instructions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {level.storyWordCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

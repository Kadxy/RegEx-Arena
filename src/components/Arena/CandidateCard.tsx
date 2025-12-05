import React from 'react';
import type { RegexCandidate } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface CandidateCardProps {
  candidate: RegexCandidate;
  onSelect: () => void;
  highlighted?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  highlighted = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card
      hoverable
      className={`mb-4 transition-all duration-200 ${
        highlighted ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">pass rate</span>
          </div>
          <code className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded font-mono block break-all">
            /{candidate.pattern}/{candidate.flags || '-'}
          </code>
        </div>
      </div>

      {candidate.explanation && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {candidate.explanation}
        </p>
      )}

      {/* Pass rate bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              candidate.passRate >= 90
                ? 'bg-green-500'
                : candidate.passRate >= 70
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${candidate.passRate}%` }}
          />
        </div>
      </div>

      {/* Failed cases */}
      {candidate.failedCases.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Failed cases ({candidate.failedCases.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {candidate.failedCases.slice(0, 3).map((failedCase, idx) => (
              <code
                key={idx}
                className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded"
              >
                {failedCase}
              </code>
            ))}
            {candidate.failedCases.length > 3 && (
              <span className="text-xs text-gray-500">
                +{candidate.failedCases.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <Button onClick={onSelect} variant="primary" size="sm" className="w-full">
        Select & Edit
      </Button>
    </Card>
  );
};

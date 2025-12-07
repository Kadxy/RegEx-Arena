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
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (score >= 70) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
  };

  return (
    <Card
      hoverable
      className={`mb-4 transition-all duration-200 hover:scale-[1.02] ${
        highlighted ? 'ring-2 ring-blue-500 shadow-2xl' : 'shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${getScoreBadgeColor(candidate.score)}`}>
              {candidate.score.toFixed(0)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Match Rate</span>
          </div>
          <code className="text-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-4 py-3 rounded-lg font-mono block break-all border border-gray-200 dark:border-gray-600">
            <span className="text-blue-600 dark:text-blue-400">/</span>
            {candidate.pattern}
            <span className="text-blue-600 dark:text-blue-400">/</span>
            <span className="text-purple-600 dark:text-purple-400">{candidate.flags || ''}</span>
          </code>
        </div>
      </div>

      {candidate.explanation && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {candidate.explanation}
        </p>
      )}

      {/* Pass rate bar */}
      <div className="mb-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 ${
              candidate.passRate >= 90
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                : candidate.passRate >= 70
                ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                : 'bg-gradient-to-r from-rose-400 to-rose-600'
            }`}
            style={{ width: `${candidate.passRate}%` }}
          />
        </div>
      </div>

      {/* Failed cases */}
      {candidate.failedCases.length > 0 && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-lg">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
            Failed cases ({candidate.failedCases.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {candidate.failedCases.slice(0, 3).map((failedCase, idx) => (
              <code
                key={idx}
                className="text-xs bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 px-2 py-1 rounded border border-rose-300 dark:border-rose-700"
              >
                {failedCase}
              </code>
            ))}
            {candidate.failedCases.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                +{candidate.failedCases.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <Button 
        onClick={onSelect} 
        variant="primary" 
        size="md" 
        className="w-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        Open in Editor →
      </Button>
    </Card>
  );
};

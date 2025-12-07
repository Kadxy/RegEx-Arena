import React from 'react';
import { useAppStore } from '../../store';
import { BenchmarkCard } from './BenchmarkCard';
import { CandidateCard } from './CandidateCard';
import { CardSkeleton } from '../common/Skeleton';
import { Button } from '../common/Button';

export const Arena: React.FC = () => {
  const {
    intent,
    benchmarks,
    candidates,
    isLoadingBenchmarks,
    isLoadingCandidates,
    selectCandidate,
    setStage,
  } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                RegEx Arena
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Intent: <span className="font-medium">{intent || 'Pattern matching'}</span>
              </p>
            </div>
            <Button onClick={() => setStage('portal')} variant="outline" size="sm">
              ← Back to Portal
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Benchmarks */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Benchmark Suites
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test cases to validate your patterns
              </p>
            </div>

            {isLoadingBenchmarks ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div className="space-y-3">
                {benchmarks.map((benchmark) => (
                  <BenchmarkCard
                    key={benchmark.id}
                    benchmark={benchmark}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Candidates */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Regex Candidates
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-generated patterns ranked by performance
              </p>
            </div>

            {isLoadingCandidates ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div>
                {candidates
                  .sort((a, b) => b.score - a.score)
                  .map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={() => selectCandidate(candidate.id)}
                      highlighted={false}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

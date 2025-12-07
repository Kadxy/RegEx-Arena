import React from 'react';
import type { Benchmark } from '../../types';
import { Card } from '../common/Card';

interface BenchmarkCardProps {
  benchmark: Benchmark;
  onHover?: (benchmarkId: string | null) => void;
}

export const BenchmarkCard: React.FC<BenchmarkCardProps> = ({ benchmark, onHover }) => {
  return (
    <Card
      hoverable
      onMouseEnter={() => onHover?.(benchmark.id)}
      onMouseLeave={() => onHover?.(null)}
      className="mb-3"
    >
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
        {benchmark.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {benchmark.description}
      </p>
      <div className="space-y-2">
        {benchmark.testCases.map((testCase) => (
          <div
            key={testCase.id}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                testCase.shouldMatch ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono flex-1">
              {testCase.input}
            </code>
            <span className="text-xs text-gray-500">
              {testCase.shouldMatch ? 'match' : 'no match'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

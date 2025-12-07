import React, { useMemo } from 'react';
import { useAppStore } from '../../store';
import { testRegex, getHighlightedMatches } from '../../utils/regex';
import type { TestCase } from '../../types';

interface TestListProps {
  tests: TestCase[];
  onDeleteTest?: (testId: string) => void;
  onEditTest?: (testId: string, currentValue: string) => void;
  editingTestId?: string | null;
  editValue?: string;
  onEditValueChange?: (value: string) => void;
  onSaveEdit?: (testId: string) => void;
  onCancelEdit?: () => void;
}

export const TestList: React.FC<TestListProps> = ({ 
  tests, 
  onDeleteTest,
  onEditTest,
  editingTestId,
  editValue,
  onEditValueChange,
  onSaveEdit,
  onCancelEdit
}) => {
  const { workbenchPattern, workbenchFlags } = useAppStore();

  const testResults = useMemo(() => {
    return tests.map((test) => {
      const result = testRegex(workbenchPattern, workbenchFlags, test.input);
      const matches = getHighlightedMatches(workbenchPattern, workbenchFlags, test.input);
      const passed = result.matched === test.shouldMatch;

      return {
        test,
        result,
        matches,
        passed,
      };
    });
  }, [tests, workbenchPattern, workbenchFlags]);

  const passedCount = testResults.filter((r) => r.passed).length;
  const passRate = tests.length > 0 ? (passedCount / tests.length) * 100 : 0;

  return (
    <div>
      {/* Summary Stats - Redesigned */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{passedCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Passed</div>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{tests.length - passedCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
          </div>
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                passRate >= 90
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : passRate >= 70
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {passRate.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pass Rate</div>
          </div>
        </div>
        
        {/* Circular progress indicator */}
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${(passRate / 100) * 201} 201`}
              className={`transition-all duration-500 ${
                passRate >= 90
                  ? 'text-emerald-500'
                  : passRate >= 70
                  ? 'text-amber-500'
                  : 'text-rose-500'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {passedCount}/{tests.length}
            </span>
          </div>
        </div>
      </div>

      {/* Test Cards - Beautiful redesign */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {testResults.map(({ test, result, matches, passed }) => (
          <div
            key={test.id}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              passed
                ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10'
                : 'border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/10 dark:to-red-900/10'
            }`}
          >
            {/* Status indicator stripe */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                passed ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />

            <div className="p-4 pl-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                      passed ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {passed ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {test.shouldMatch ? 'Should Match' : 'Should NOT Match'}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                {test.id.startsWith('custom-') && editingTestId !== test.id && (
                  <div className="flex items-center gap-2">
                    {onEditTest && (
                      <button
                        onClick={() => onEditTest(test.id, test.input)}
                        className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDeleteTest && (
                      <button
                        onClick={() => onDeleteTest(test.id)}
                        className="text-xs px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Test Input */}
              {editingTestId === test.id ? (
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => onEditValueChange?.(e.target.value)}
                    className="w-full px-3 py-2 text-sm border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveEdit?.(test.id);
                      if (e.key === 'Escape') onCancelEdit?.();
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSaveEdit?.(test.id)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <code className="block text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono break-all shadow-sm">
                      {test.input}
                    </code>
                  </div>

                  {/* Match Info */}
                  {matches.length > 0 && (
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {matches.length} match(es) found
                      </div>
                      <div className="space-y-1">
                        {matches.slice(0, 2).map((match, idx) => (
                          <div key={idx} className="text-sm">
                            <code className="bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 inline-block">
                              {test.input.substring(0, match.start)}
                              <mark className="bg-amber-300 dark:bg-amber-600 px-1 rounded font-semibold">
                                {test.input.substring(match.start, match.end)}
                              </mark>
                              {test.input.substring(match.end)}
                            </code>
                          </div>
                        ))}
                        {matches.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                            +{matches.length - 2} more matches
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 mt-2 p-2 bg-rose-100 dark:bg-rose-900/20 rounded">
                      <span className="font-semibold">Error:</span> {result.error}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Failed cases summary - More elegant */}
      {passRate < 100 && passRate > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-l-4 border-rose-500 rounded-lg">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-200 mb-3">
            Failed Test Cases ({tests.length - passedCount})
          </p>
          <div className="flex flex-wrap gap-2">
            {testResults
              .filter((r) => !r.passed)
              .slice(0, 6)
              .map(({ test }) => (
                <code
                  key={test.id}
                  className="text-xs bg-white dark:bg-gray-800 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 font-mono shadow-sm"
                >
                  {test.input.length > 25 ? test.input.substring(0, 25) + '...' : test.input}
                </code>
              ))}
            {tests.length - passedCount > 6 && (
              <span className="text-xs text-gray-600 dark:text-gray-400 px-3 py-1.5">
                +{tests.length - passedCount - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

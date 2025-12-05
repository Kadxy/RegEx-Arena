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
      {/* Summary Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {passedCount}/{tests.length} passing
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              passRate >= 90
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                : passRate >= 70
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
            }`}
          >
            {passRate.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Pass rate bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 ${
              passRate >= 90 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                : passRate >= 70 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600' 
                : 'bg-gradient-to-r from-rose-400 to-rose-600'
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>

      {/* Compact Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
        {testResults.map(({ test, result, matches, passed }) => (
          <div
            key={test.id}
            className={`border-2 rounded-lg p-3 transition-all ${
              passed
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/10'
            }`}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{passed ? '✓' : '✗'}</span>
              <div className="flex items-center gap-1">
                {onEditTest && test.id.startsWith('custom-') && editingTestId !== test.id && (
                  <button
                    onClick={() => onEditTest(test.id, test.input)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    title="Edit test case"
                  >
                    Edit
                  </button>
                )}
                {onDeleteTest && test.id.startsWith('custom-') && (
                  <>
                    <span className="text-gray-400">•</span>
                    <button
                      onClick={() => onDeleteTest(test.id)}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                      title="Delete test case"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Test Input */}
            {editingTestId === test.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => onEditValueChange?.(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSaveEdit?.(test.id);
                    if (e.key === 'Escape') onCancelEdit?.();
                  }}
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => onSaveEdit?.(test.id)}
                    className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-2 py-1 text-xs bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded font-mono block break-all border border-gray-300 dark:border-gray-600 mb-2">
                  {test.input}
                </code>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Should {test.shouldMatch ? 'match' : 'not match'}
                </div>

                {/* Match Info */}
                {matches.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {matches.length} match(es)
                    </div>
                    {matches.slice(0, 1).map((match, idx) => (
                      <div key={idx} className="text-xs">
                        <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                          <mark className="bg-amber-300 dark:bg-amber-600 px-0.5 rounded">
                            {test.input.substring(match.start, match.end)}
                          </mark>
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {result.error && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                    Error: {result.error}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Failed cases summary - More compact */}
      {passRate < 100 && (
        <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
          <p className="text-xs font-semibold text-rose-800 dark:text-rose-200 mb-2">
            Failed: {tests.length - passedCount} case(s)
          </p>
          <div className="flex flex-wrap gap-1">
            {testResults
              .filter((r) => !r.passed)
              .slice(0, 5)
              .map(({ test }) => (
                <code
                  key={test.id}
                  className="text-xs bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700 font-mono"
                >
                  {test.input.length > 20 ? test.input.substring(0, 20) + '...' : test.input}
                </code>
              ))}
            {tests.length - passedCount > 5 && (
              <span className="text-xs text-gray-500">
                +{tests.length - passedCount - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

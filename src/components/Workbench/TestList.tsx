import React, { useMemo } from 'react';
import { useAppStore } from '../../store';
import { testRegex, getHighlightedMatches } from '../../utils/regex';
import type { TestCase } from '../../types';

interface TestListProps {
  tests: TestCase[];
}

export const TestList: React.FC<TestListProps> = ({ tests }) => {
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Cases</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {passedCount}/{tests.length} passing
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              passRate >= 90
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : passRate >= 70
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {passRate.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Pass rate bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              passRate >= 90 ? 'bg-green-500' : passRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>

      {/* Test cases */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {testResults.map(({ test, result, matches, passed }) => (
          <div
            key={test.id}
            className={`border rounded-lg p-3 transition-all ${
              passed
                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">{passed ? '✓' : '✗'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded font-mono">
                    {test.input}
                  </code>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    should {test.shouldMatch ? 'match' : 'not match'}
                  </span>
                </div>

                {/* Highlighted matches */}
                {matches.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {matches.length} match(es) found:
                    </div>
                    <div className="space-y-1">
                      {matches.map((match, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded"
                        >
                          <span className="font-mono">
                            {test.input.substring(0, match.start)}
                            <mark className="bg-yellow-300 dark:bg-yellow-600 px-1">
                              {test.input.substring(match.start, match.end)}
                            </mark>
                            {test.input.substring(match.end)}
                          </span>
                          {match.groups && Object.keys(match.groups).length > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Groups:{' '}
                              {Object.entries(match.groups).map(([key, value]) => (
                                <span key={key} className="ml-2">
                                  {key}: <code className="bg-gray-100 dark:bg-gray-700 px-1">{value}</code>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.error && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Error: {result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Failed cases summary */}
      {passRate < 100 && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed Cases ({tests.length - passedCount}):
          </p>
          <div className="flex flex-wrap gap-2">
            {testResults
              .filter((r) => !r.passed)
              .map(({ test }) => (
                <code
                  key={test.id}
                  className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-1 rounded"
                >
                  {test.input}
                </code>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

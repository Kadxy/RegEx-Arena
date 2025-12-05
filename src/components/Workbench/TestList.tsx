import React, { useMemo } from 'react';
import { useAppStore } from '../../store';
import { testRegex, getHighlightedMatches } from '../../utils/regex';
import type { TestCase } from '../../types';

interface TestListProps {
  tests: TestCase[];
  onDeleteTest?: (testId: string) => void;
}

export const TestList: React.FC<TestListProps> = ({ tests, onDeleteTest }) => {
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
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
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

      {/* Test cases */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {testResults.map(({ test, result, matches, passed }) => (
          <div
            key={test.id}
            className={`border-2 rounded-xl p-4 transition-all ${
              passed
                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10'
                : 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{passed ? '✓' : '✗'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg font-mono border border-gray-300 dark:border-gray-600">
                    {test.input}
                  </code>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    should {test.shouldMatch ? 'match' : 'not match'}
                  </span>
                  {onDeleteTest && test.id.startsWith('custom-') && (
                    <button
                      onClick={() => onDeleteTest(test.id)}
                      className="ml-auto text-xs text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium"
                      title="Delete test case"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>

                {/* Highlighted matches */}
                {matches.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
                      ✨ {matches.length} match(es) found:
                    </div>
                    <div className="space-y-2">
                      {matches.map((match, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        >
                          <span className="font-mono break-all">
                            {test.input.substring(0, match.start)}
                            <mark className="bg-amber-300 dark:bg-amber-600 px-1 py-0.5 rounded font-bold">
                              {test.input.substring(match.start, match.end)}
                            </mark>
                            {test.input.substring(match.end)}
                          </span>
                          {match.groups && Object.keys(match.groups).length > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="font-semibold">Capture Groups: </span>
                              {Object.entries(match.groups).map(([key, value]) => (
                                <span key={key} className="ml-2 inline-block">
                                  <span className="text-purple-600 dark:text-purple-400">{key}</span>:{' '}
                                  <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                                    {value}
                                  </code>
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
                  <div className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
                    ⚠️ Error: {result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Failed cases summary */}
      {passRate < 100 && (
        <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-xl">
          <p className="text-sm font-bold text-rose-800 dark:text-rose-200 mb-3">
            ⚠️ Failed Cases ({tests.length - passedCount}):
          </p>
          <div className="flex flex-wrap gap-2">
            {testResults
              .filter((r) => !r.passed)
              .map(({ test }) => (
                <code
                  key={test.id}
                  className="text-xs bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 font-mono"
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

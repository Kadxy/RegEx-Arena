import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../common/Button';

export const RegexEditor: React.FC = () => {
  const { workbenchPattern, workbenchFlags, setWorkbenchPattern, setWorkbenchFlags, copyPattern } =
    useAppStore();
  const [invalidSince, setInvalidSince] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Check if pattern is valid
  useEffect(() => {
    try {
      if (workbenchPattern) {
        new RegExp(workbenchPattern, workbenchFlags);
      }
      setInvalidSince(null);
      setShowWarning(false);
    } catch (error) {
      if (invalidSince === null) {
        setInvalidSince(Date.now());
      }
    }
  }, [workbenchPattern, workbenchFlags, invalidSince]);

  // Show warning after 5 seconds of invalid regex
  useEffect(() => {
    if (invalidSince !== null) {
      const timer = setTimeout(() => {
        setShowWarning(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [invalidSince]);

  const handleFlagToggle = (flag: string) => {
    if (workbenchFlags.includes(flag)) {
      setWorkbenchFlags(workbenchFlags.replace(flag, ''));
    } else {
      setWorkbenchFlags(workbenchFlags + flag);
    }
  };

  const handleCopy = () => {
    copyPattern();
  };

  const flags = [
    { key: 'g', label: 'Global' },
    { key: 'i', label: 'Case-insensitive' },
    { key: 'm', label: 'Multiline' },
    { key: 's', label: 'Dot-all' },
    { key: 'u', label: 'Unicode' },
    { key: 'y', label: 'Sticky' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regex Pattern</h3>
      </div>

      <div className="p-6">
        {/* Pattern input with inline copy button */}
        <div className="mb-4">
          <div className="flex items-stretch gap-2">
            <span className="flex items-center text-gray-500 dark:text-gray-400 font-mono text-xl">/</span>
            <input
              type="text"
              value={workbenchPattern}
              onChange={(e) => setWorkbenchPattern(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-lg"
              placeholder="Enter regex pattern..."
            />
            <span className="flex items-center text-gray-500 dark:text-gray-400 font-mono text-xl">/</span>
            <input
              type="text"
              value={workbenchFlags}
              onChange={(e) => setWorkbenchFlags(e.target.value)}
              className="w-24 px-3 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-center text-lg"
              placeholder="flags"
            />
            <Button onClick={handleCopy} variant="outline" size="md" className="px-6">
              Copy
            </Button>
          </div>
        </div>

        {/* Invalid regex warning */}
        {showWarning && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 text-rose-700 dark:text-rose-400 rounded">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠</span>
              <div className="flex-1">
                <p className="font-semibold">Invalid Regular Expression</p>
                <p className="text-sm mt-1">
                  The pattern you entered is not valid. Please check your syntax.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Flags */}
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Flags:</p>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <button
                key={flag.key}
                onClick={() => handleFlagToggle(flag.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  workbenchFlags.includes(flag.key)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {flag.key} - {flag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

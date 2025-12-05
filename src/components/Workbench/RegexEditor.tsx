import React from 'react';
import { useAppStore } from '../../store';
import { Button } from '../common/Button';

export const RegexEditor: React.FC = () => {
  const { workbenchPattern, workbenchFlags, setWorkbenchPattern, setWorkbenchFlags, copyPattern } =
    useAppStore();

  const handleFlagToggle = (flag: string) => {
    if (workbenchFlags.includes(flag)) {
      setWorkbenchFlags(workbenchFlags.replace(flag, ''));
    } else {
      setWorkbenchFlags(workbenchFlags + flag);
    }
  };

  const handleCopy = () => {
    copyPattern();
    // Show feedback (in a real app, you might want a toast notification)
  };

  const flags = [
    { key: 'g', label: 'Global', description: 'Find all matches' },
    { key: 'i', label: 'Case-insensitive', description: 'Ignore case' },
    { key: 'm', label: 'Multiline', description: '^$ match line breaks' },
    { key: 's', label: 'Dot-all', description: '. matches newlines' },
    { key: 'u', label: 'Unicode', description: 'Unicode mode' },
    { key: 'y', label: 'Sticky', description: 'Match from lastIndex' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Regex Pattern</h3>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="sm">
            📋 Copy
          </Button>
        </div>
      </div>

      {/* Pattern input */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-500 dark:text-gray-400 font-mono text-lg">/</span>
          <input
            type="text"
            value={workbenchPattern}
            onChange={(e) => setWorkbenchPattern(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
            placeholder="Enter regex pattern..."
          />
          <span className="text-gray-500 dark:text-gray-400 font-mono text-lg">/</span>
          <input
            type="text"
            value={workbenchFlags}
            onChange={(e) => setWorkbenchFlags(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-center"
            placeholder="flags"
          />
        </div>
      </div>

      {/* Flags */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Flags:</p>
        <div className="flex flex-wrap gap-2">
          {flags.map((flag) => (
            <button
              key={flag.key}
              onClick={() => handleFlagToggle(flag.key)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                workbenchFlags.includes(flag.key)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={flag.description}
            >
              {flag.key} - {flag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

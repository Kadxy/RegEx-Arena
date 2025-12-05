import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../common/Button';

export const Portal: React.FC = () => {
  const [localIntent, setLocalIntent] = useState('');
  const { submitIntent, skipToArena } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localIntent.trim()) {
      useAppStore.setState({ intent: localIntent });
      submitIntent();
    }
  };

  const handleSkip = () => {
    skipToArena();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            RegEx Arena
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Craft, test, and perfect your regular expressions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="intent"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                What pattern are you trying to match?
              </label>
              <textarea
                id="intent"
                value={localIntent}
                onChange={(e) => setLocalIntent(e.target.value)}
                placeholder="e.g., Email addresses, URLs, phone numbers, dates..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!localIntent.trim()}
              >
                Generate Patterns
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Skip to Arena →
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by AI • Test-driven regex development</p>
        </div>
      </div>
    </div>
  );
};

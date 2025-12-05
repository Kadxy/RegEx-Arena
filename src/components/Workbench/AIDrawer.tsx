import React from 'react';
import { useAppStore } from '../../store';
import { Button } from '../common/Button';

export const AIDrawer: React.FC = () => {
  const { aiDrawerOpen, aiDrawerContent, isLoadingAI, closeAIDrawer, explainRegex, fixRegex } =
    useAppStore();

  if (!aiDrawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeAIDrawer}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
            <button
              onClick={closeAIDrawer}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <Button onClick={explainRegex} variant="primary" size="sm" disabled={isLoadingAI}>
              🤖 Explain Pattern
            </Button>
            <Button
              onClick={() => fixRegex('Pattern not matching expected cases')}
              variant="secondary"
              size="sm"
              disabled={isLoadingAI}
            >
              🔧 Suggest Fix
            </Button>
          </div>

          {/* Content */}
          {isLoadingAI ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : aiDrawerContent ? (
            <div className="prose dark:prose-invert max-w-none">
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: aiDrawerContent.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="mb-4">Select an action to get AI assistance</p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    🤖 Explain Pattern
                  </p>
                  <p className="text-sm">
                    Get a detailed explanation of your regex pattern and how it works.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    🔧 Suggest Fix
                  </p>
                  <p className="text-sm">
                    Get suggestions to fix issues with your pattern.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

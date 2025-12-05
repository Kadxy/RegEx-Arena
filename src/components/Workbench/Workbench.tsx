import React from 'react';
import { useAppStore } from '../../store';
import { RegexEditor } from './RegexEditor';
import { TestList } from './TestList';
import { AIDrawer } from './AIDrawer';
import { Button } from '../common/Button';

export const Workbench: React.FC = () => {
  const { workbenchTests, setStage, openAIDrawer } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workbench</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Edit and test your regex pattern
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={openAIDrawer} variant="primary" size="sm">
                🤖 AI Assistant
              </Button>
              <Button onClick={() => setStage('arena')} variant="outline" size="sm">
                ← Back to Arena
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Regex Editor */}
          <RegexEditor />

          {/* Test List */}
          {workbenchTests.length > 0 && <TestList tests={workbenchTests} />}

          {workbenchTests.length === 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No test cases available. Go back to the Arena to select a candidate with test cases.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Drawer */}
      <AIDrawer />
    </div>
  );
};

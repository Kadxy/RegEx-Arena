import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { RegexEditor } from './RegexEditor';
import { TestList } from './TestList';
import { AIDrawer } from './AIDrawer';
import { Button } from '../common/Button';

export const Workbench: React.FC = () => {
  const { workbenchTests, setStage, openAIDrawer, setWorkbenchTests } = useAppStore();
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTestInput, setNewTestInput] = useState('');
  const [newTestShouldMatch, setNewTestShouldMatch] = useState(true);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddTest = () => {
    if (newTestInput.trim()) {
      const newTest = {
        id: `custom-${Date.now()}`,
        input: newTestInput,
        shouldMatch: newTestShouldMatch,
      };
      setWorkbenchTests([...workbenchTests, newTest]);
      setNewTestInput('');
      setShowAddTest(false);
    }
  };

  const handleDeleteTest = (testId: string) => {
    setWorkbenchTests(workbenchTests.filter(t => t.id !== testId));
  };

  const handleEditTest = (testId: string, currentValue: string) => {
    setEditingTestId(testId);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (testId: string) => {
    if (editValue.trim()) {
      setWorkbenchTests(workbenchTests.map(t => 
        t.id === testId ? { ...t, input: editValue } : t
      ));
    }
    setEditingTestId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingTestId(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workbench
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Edit, test, and perfect your regex pattern
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={openAIDrawer} variant="primary" size="sm" className="shadow-lg">
                AI Assistant
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

          {/* Test Cases Section */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Test Cases
                </h3>
                <Button
                  onClick={() => setShowAddTest(!showAddTest)}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  {showAddTest ? 'Cancel' : '+ Add Test'}
                </Button>
              </div>
            </div>

            {/* Add Test Form */}
            {showAddTest && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Test Input:
                    </label>
                    <input
                      type="text"
                      value={newTestInput}
                      onChange={(e) => setNewTestInput(e.target.value)}
                      placeholder="Enter test string..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTest()}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newTestShouldMatch}
                        onChange={() => setNewTestShouldMatch(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Should Match</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!newTestShouldMatch}
                        onChange={() => setNewTestShouldMatch(false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Should NOT Match</span>
                    </label>
                  </div>
                  <Button
                    onClick={handleAddTest}
                    variant="primary"
                    size="sm"
                    disabled={!newTestInput.trim()}
                    className="w-full"
                  >
                    Add Test Case
                  </Button>
                </div>
              </div>
            )}

            {/* Test List */}
            {workbenchTests.length > 0 ? (
              <div className="p-4">
                <TestList 
                  tests={workbenchTests} 
                  onDeleteTest={handleDeleteTest}
                  onEditTest={handleEditTest}
                  editingTestId={editingTestId}
                  editValue={editValue}
                  onEditValueChange={setEditValue}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No test cases yet. Add your own or go back to the Arena to select a candidate.
                </p>
                <Button
                  onClick={() => setShowAddTest(true)}
                  variant="primary"
                  size="sm"
                >
                  + Add First Test Case
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Drawer */}
      <AIDrawer />
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../common/Button';

type InputMode = 'simple' | 'highlight';

export const Portal: React.FC = () => {
  const [localIntent, setLocalIntent] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('simple');
  const [highlightText, setHighlightText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { submitIntent, skipToArena } = useAppStore();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const intent = inputMode === 'simple' ? localIntent : `Extract patterns like: "${selectedText}" from text`;
    if (intent.trim()) {
      useAppStore.setState({ intent });
      submitIntent();
    }
  };

  const handleSkip = () => {
    skipToArena();
  };

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      if (start !== end) {
        const selected = highlightText.substring(start, end);
        setSelectedText(selected);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto-expand on Enter if Shift is not held
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4 mx-auto">
              <span className="text-4xl">🎯</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            RegEx Arena
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            AI-powered regex crafting and testing
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6 gap-3">
          <button
            onClick={() => setInputMode('simple')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              inputMode === 'simple'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            🔍 Quick Search
          </button>
          <button
            onClick={() => setInputMode('highlight')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              inputMode === 'highlight'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            ✨ Highlight & Extract
          </button>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
          <form onSubmit={handleSubmit}>
            {inputMode === 'simple' ? (
              <div className="relative">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl">
                  🔍
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={localIntent}
                  onChange={(e) => setLocalIntent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want to match... (e.g., email addresses, phone numbers)"
                  className="w-full pl-16 pr-6 py-6 text-lg bg-transparent border-none outline-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  autoComplete="off"
                />
              </div>
            ) : (
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Paste your text and highlight the pattern you want to extract:
                </label>
                <textarea
                  ref={textareaRef}
                  value={highlightText}
                  onChange={(e) => setHighlightText(e.target.value)}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  placeholder="Paste your text here, then select/highlight the words or patterns you want to extract..."
                  className="w-full min-h-[150px] p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-y"
                />
                {selectedText && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Selected pattern:</p>
                    <code className="text-sm font-mono bg-white dark:bg-gray-800 px-3 py-1 rounded border border-blue-300 dark:border-blue-700">
                      {selectedText}
                    </code>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 text-lg py-4 shadow-lg hover:shadow-xl"
                disabled={inputMode === 'simple' ? !localIntent.trim() : !selectedText.trim()}
              >
                ✨ Generate Regex Patterns
              </Button>
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Skip →
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart pattern generation</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Real-time Testing</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Instant validation</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl p-4">
            <div className="text-2xl mb-2">🚀</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Test-Driven</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Comprehensive benchmarks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

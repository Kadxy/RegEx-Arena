import type { MatchResult, HighlightedMatch } from '../types';

/**
 * Safely compiles a regex pattern with error handling
 */
export function safeCompileRegex(pattern: string, flags: string): RegExp | null {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    console.error('Regex compilation error:', error);
    return null;
  }
}

/**
 * Tests a regex against an input string
 */
export function testRegex(pattern: string, flags: string, input: string): MatchResult {
  const regex = safeCompileRegex(pattern, flags);
  
  if (!regex) {
    return {
      matched: false,
      error: 'Invalid regex pattern',
    };
  }

  try {
    const matches: RegExpMatchArray[] = [];
    
    if (flags.includes('g')) {
      // Global flag: find all matches
      let match;
      while ((match = regex.exec(input)) !== null) {
        matches.push(match);
        // Prevent infinite loop on zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      // Non-global: find first match
      const match = input.match(regex);
      if (match) {
        matches.push(match);
      }
    }

    return {
      matched: matches.length > 0,
      matches,
    };
  } catch (error) {
    return {
      matched: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gets highlighted match positions from the input string
 */
export function getHighlightedMatches(
  pattern: string,
  flags: string,
  input: string
): HighlightedMatch[] {
  const result = testRegex(pattern, flags, input);
  
  if (!result.matched || !result.matches) {
    return [];
  }

  return result.matches.map(match => {
    const groups: { [key: string]: string } = {};
    
    if (match.groups) {
      Object.entries(match.groups).forEach(([key, value]) => {
        if (value !== undefined) {
          groups[key] = value;
        }
      });
    }

    return {
      start: match.index || 0,
      end: (match.index || 0) + match[0].length,
      groups: Object.keys(groups).length > 0 ? groups : undefined,
    };
  });
}

/**
 * Highlights matches in a string with HTML spans
 */
export function highlightMatches(input: string, matches: HighlightedMatch[]): string {
  if (matches.length === 0) return input;

  const sortedMatches = [...matches].sort((a, b) => a.start - b.start);
  let result = '';
  let lastIndex = 0;

  sortedMatches.forEach((match, idx) => {
    // Add text before match
    result += escapeHtml(input.substring(lastIndex, match.start));
    
    // Add highlighted match
    result += `<mark class="bg-yellow-300 dark:bg-yellow-600" data-match-index="${idx}">`;
    result += escapeHtml(input.substring(match.start, match.end));
    result += '</mark>';
    
    lastIndex = match.end;
  });

  // Add remaining text
  result += escapeHtml(input.substring(lastIndex));

  return result;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Evaluates a regex against a test case
 */
export function evaluateTestCase(
  pattern: string,
  flags: string,
  input: string,
  shouldMatch: boolean
): boolean {
  const result = testRegex(pattern, flags, input);
  
  if (result.error) {
    return false;
  }

  return result.matched === shouldMatch;
}

/**
 * Calculates pass rate for a regex against test cases
 */
export function calculatePassRate(
  pattern: string,
  flags: string,
  testCases: Array<{ input: string; shouldMatch: boolean }>
): { passRate: number; failedCases: string[] } {
  let passed = 0;
  const failedCases: string[] = [];

  testCases.forEach(testCase => {
    const isPassing = evaluateTestCase(pattern, flags, testCase.input, testCase.shouldMatch);
    if (isPassing) {
      passed++;
    } else {
      failedCases.push(testCase.input);
    }
  });

  return {
    passRate: testCases.length > 0 ? (passed / testCases.length) * 100 : 0,
    failedCases,
  };
}

export type Stage = 'portal' | 'arena' | 'workbench';

export interface TestCase {
  id: string;
  input: string;
  shouldMatch: boolean;
  expectedCaptures?: string[];
}

export interface Benchmark {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  editable?: boolean;
}

export interface RegexCandidate {
  id: string;
  pattern: string;
  flags: string;
  score: number;
  passRate: number;
  failedCases: string[];
  explanation?: string;
}

export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export interface MatchResult {
  matched: boolean;
  matches?: RegExpMatchArray[];
  error?: string;
}

export interface HighlightedMatch {
  start: number;
  end: number;
  groups?: { [key: string]: string };
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}

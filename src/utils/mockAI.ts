import type { AIResponse, Benchmark, RegexCandidate } from '../types';

/**
 * Mock AI client that returns deterministic delayed responses
 */
export class MockAIClient {
  private delay: number;

  constructor(delay: number = 1000) {
    this.delay = delay;
  }

  /**
   * Simulates a delay
   */
  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  /**
   * Generates mock benchmarks based on user intent
   */
  async generateBenchmarks(intent: string): Promise<Benchmark[]> {
    await this.simulateDelay();

    // Return deterministic mock data based on intent
    const intentLower = intent.toLowerCase();
    
    if (intentLower.includes('email')) {
      return this.getEmailBenchmarks();
    } else if (intentLower.includes('url') || intentLower.includes('link')) {
      return this.getUrlBenchmarks();
    } else if (intentLower.includes('phone')) {
      return this.getPhoneBenchmarks();
    } else if (intentLower.includes('date')) {
      return this.getDateBenchmarks();
    }

    // Default generic benchmarks
    return this.getGenericBenchmarks();
  }

  /**
   * Generates mock regex candidates
   */
  async generateCandidates(intent: string, _benchmarks: Benchmark[]): Promise<RegexCandidate[]> {
    await this.simulateDelay();

    const intentLower = intent.toLowerCase();
    
    if (intentLower.includes('email')) {
      return this.getEmailCandidates();
    } else if (intentLower.includes('url') || intentLower.includes('link')) {
      return this.getUrlCandidates();
    } else if (intentLower.includes('phone')) {
      return this.getPhoneCandidates();
    } else if (intentLower.includes('date')) {
      return this.getDateCandidates();
    }

    return this.getGenericCandidates();
  }

  /**
   * Explains a regex pattern
   */
  async explainRegex(pattern: string, flags: string): Promise<AIResponse> {
    await this.simulateDelay();

    return {
      success: true,
      content: this.generateExplanation(pattern, flags),
    };
  }

  /**
   * Suggests a fix for a regex
   */
  async fixRegex(pattern: string, _flags: string, issue: string): Promise<AIResponse> {
    await this.simulateDelay();

    return {
      success: true,
      content: this.generateFix(pattern, issue),
    };
  }

  // Mock data generators

  private getEmailBenchmarks(): Benchmark[] {
    return [
      {
        id: 'email-basic',
        name: 'Basic Email Format',
        description: 'Validates standard email addresses',
        testCases: [
          { id: '1', input: 'user@example.com', shouldMatch: true },
          { id: '2', input: 'test.user@domain.co.uk', shouldMatch: true },
          { id: '3', input: 'invalid@', shouldMatch: false },
          { id: '4', input: '@example.com', shouldMatch: false },
          { id: '5', input: 'user@.com', shouldMatch: false },
        ],
      },
      {
        id: 'email-special',
        name: 'Special Characters',
        description: 'Handles emails with special characters',
        testCases: [
          { id: '1', input: 'user+tag@example.com', shouldMatch: true },
          { id: '2', input: 'user_name@example.com', shouldMatch: true },
          { id: '3', input: 'user name@example.com', shouldMatch: false },
          { id: '4', input: 'user#test@example.com', shouldMatch: false },
        ],
      },
    ];
  }

  private getUrlBenchmarks(): Benchmark[] {
    return [
      {
        id: 'url-http',
        name: 'HTTP/HTTPS URLs',
        description: 'Matches web URLs',
        testCases: [
          { id: '1', input: 'https://example.com', shouldMatch: true },
          { id: '2', input: 'http://test.example.com/path', shouldMatch: true },
          { id: '3', input: 'ftp://files.example.com', shouldMatch: false },
          { id: '4', input: 'not-a-url', shouldMatch: false },
        ],
      },
      {
        id: 'url-query',
        name: 'URLs with Query Params',
        description: 'Handles query strings',
        testCases: [
          { id: '1', input: 'https://example.com?key=value', shouldMatch: true },
          { id: '2', input: 'https://example.com?a=1&b=2', shouldMatch: true },
          { id: '3', input: 'https://example.com#anchor', shouldMatch: true },
        ],
      },
    ];
  }

  private getPhoneBenchmarks(): Benchmark[] {
    return [
      {
        id: 'phone-us',
        name: 'US Phone Numbers',
        description: 'Matches US phone format',
        testCases: [
          { id: '1', input: '(555) 123-4567', shouldMatch: true },
          { id: '2', input: '555-123-4567', shouldMatch: true },
          { id: '3', input: '5551234567', shouldMatch: true },
          { id: '4', input: '123', shouldMatch: false },
        ],
      },
    ];
  }

  private getDateBenchmarks(): Benchmark[] {
    return [
      {
        id: 'date-iso',
        name: 'ISO Date Format',
        description: 'Matches YYYY-MM-DD',
        testCases: [
          { id: '1', input: '2024-12-05', shouldMatch: true },
          { id: '2', input: '2024-1-5', shouldMatch: false },
          { id: '3', input: '12/05/2024', shouldMatch: false },
        ],
      },
    ];
  }

  private getGenericBenchmarks(): Benchmark[] {
    return [
      {
        id: 'generic-1',
        name: 'Pattern Matching',
        description: 'Basic pattern validation',
        testCases: [
          { id: '1', input: 'test123', shouldMatch: true },
          { id: '2', input: 'test', shouldMatch: true },
          { id: '3', input: '123', shouldMatch: false },
        ],
      },
    ];
  }

  private getEmailCandidates(): RegexCandidate[] {
    return [
      {
        id: 'email-1',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        flags: '',
        score: 95,
        passRate: 95,
        failedCases: [],
        explanation: 'Standard email validation pattern',
      },
      {
        id: 'email-2',
        pattern: '^[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
        flags: '',
        score: 90,
        passRate: 90,
        failedCases: [],
        explanation: 'Simplified email pattern using word characters',
      },
      {
        id: 'email-3',
        pattern: '^.+@.+\\..+$',
        flags: '',
        score: 70,
        passRate: 70,
        failedCases: ['invalid@', '@example.com'],
        explanation: 'Basic email pattern (less strict)',
      },
    ];
  }

  private getUrlCandidates(): RegexCandidate[] {
    return [
      {
        id: 'url-1',
        pattern: '^https?://[\\w.-]+(:\\d+)?(/[^\\s]*)?$',
        flags: '',
        score: 92,
        passRate: 92,
        failedCases: [],
        explanation: 'HTTP/HTTPS URL matcher',
      },
      {
        id: 'url-2',
        pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
        flags: 'i',
        score: 88,
        passRate: 88,
        failedCases: [],
        explanation: 'Flexible URL pattern',
      },
    ];
  }

  private getPhoneCandidates(): RegexCandidate[] {
    return [
      {
        id: 'phone-1',
        pattern: '^\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}$',
        flags: '',
        score: 93,
        passRate: 93,
        failedCases: [],
        explanation: 'US phone number with optional formatting',
      },
    ];
  }

  private getDateCandidates(): RegexCandidate[] {
    return [
      {
        id: 'date-1',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        flags: '',
        score: 95,
        passRate: 95,
        failedCases: [],
        explanation: 'ISO 8601 date format (YYYY-MM-DD)',
      },
    ];
  }

  private getGenericCandidates(): RegexCandidate[] {
    return [
      {
        id: 'generic-1',
        pattern: '^\\w+\\d*$',
        flags: '',
        score: 85,
        passRate: 85,
        failedCases: [],
        explanation: 'Alphanumeric pattern',
      },
    ];
  }

  private generateExplanation(pattern: string, flags: string): string {
    return `**Pattern Breakdown:**

\`${pattern}\`${flags ? ` with flags: \`${flags}\`` : ''}

This regular expression pattern:
- Uses character classes and quantifiers to define matching rules
- ${flags.includes('i') ? 'Is case-insensitive (i flag)' : 'Is case-sensitive'}
- ${flags.includes('g') ? 'Matches all occurrences (g flag)' : 'Matches first occurrence only'}
- ${flags.includes('m') ? 'Works across multiple lines (m flag)' : 'Single line matching'}

**Usage:**
This pattern can be used to validate or extract specific text patterns from strings.`;
  }

  private generateFix(pattern: string, issue: string): string {
    return `**Suggested Fix:**

Original pattern: \`${pattern}\`

**Issue identified:** ${issue}

**Recommended changes:**
- Consider escaping special characters if matching literals
- Add anchors (^ and $) for full string matching
- Use non-capturing groups (?:...) for better performance
- Add appropriate quantifiers for flexibility

**Improved pattern:**
\`${pattern.replace(/\./g, '\\.')}\`

This should resolve the issue while maintaining the intended matching behavior.`;
  }
}

// Singleton instance
export const mockAI = new MockAIClient(800);

import { create } from 'zustand';
import type { Stage, Benchmark, RegexCandidate, TestCase } from '../types';
import { mockAI } from '../utils/mockAI';
import { calculatePassRate } from '../utils/regex';

interface AppState {
  // Current stage
  stage: Stage;
  
  // Portal data
  intent: string;
  
  // Arena data
  benchmarks: Benchmark[];
  candidates: RegexCandidate[];
  selectedCandidateId: string | null;
  isLoadingBenchmarks: boolean;
  isLoadingCandidates: boolean;
  
  // Workbench data
  workbenchPattern: string;
  workbenchFlags: string;
  workbenchTests: TestCase[];
  aiDrawerOpen: boolean;
  aiDrawerContent: string;
  isLoadingAI: boolean;
  
  // Actions
  setStage: (stage: Stage) => void;
  setIntent: (intent: string) => void;
  
  // Portal actions
  submitIntent: () => Promise<void>;
  skipToArena: () => void;
  
  // Arena actions
  selectCandidate: (candidateId: string) => void;
  updateBenchmark: (benchmarkId: string, testCases: TestCase[]) => void;
  rescoreCandidates: () => void;
  
  // Workbench actions
  setWorkbenchPattern: (pattern: string) => void;
  setWorkbenchFlags: (flags: string) => void;
  setWorkbenchTests: (tests: TestCase[]) => void;
  openAIDrawer: () => void;
  closeAIDrawer: () => void;
  explainRegex: () => Promise<void>;
  fixRegex: (issue: string) => Promise<void>;
  copyPattern: () => void;
  
  // Reset
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  stage: 'portal',
  intent: '',
  benchmarks: [],
  candidates: [],
  selectedCandidateId: null,
  isLoadingBenchmarks: false,
  isLoadingCandidates: false,
  workbenchPattern: '',
  workbenchFlags: '',
  workbenchTests: [],
  aiDrawerOpen: false,
  aiDrawerContent: '',
  isLoadingAI: false,

  // Basic setters
  setStage: (stage) => set({ stage }),
  setIntent: (intent) => set({ intent }),

  // Portal actions
  submitIntent: async () => {
    const { intent } = get();
    
    set({ isLoadingBenchmarks: true, isLoadingCandidates: true, stage: 'arena' });
    
    try {
      // Generate benchmarks
      const benchmarks = await mockAI.generateBenchmarks(intent);
      set({ benchmarks, isLoadingBenchmarks: false });
      
      // Generate candidates
      const candidates = await mockAI.generateCandidates(intent, benchmarks);
      
      // Calculate actual pass rates based on benchmarks
      const updatedCandidates = candidates.map(candidate => {
        const allTestCases = benchmarks.flatMap(b => b.testCases);
        const { passRate, failedCases } = calculatePassRate(
          candidate.pattern,
          candidate.flags,
          allTestCases
        );
        
        return {
          ...candidate,
          passRate,
          failedCases,
          score: passRate,
        };
      });
      
      set({ candidates: updatedCandidates, isLoadingCandidates: false });
    } catch (error) {
      console.error('Error generating arena data:', error);
      set({ isLoadingBenchmarks: false, isLoadingCandidates: false });
    }
  },

  skipToArena: () => {
    // Skip to arena with default data
    set({
      stage: 'arena',
      intent: 'Sample pattern matching',
      benchmarks: [
        {
          id: 'sample-1',
          name: 'Sample Benchmark',
          description: 'Example test suite',
          testCases: [
            { id: '1', input: 'test123', shouldMatch: true },
            { id: '2', input: 'test', shouldMatch: true },
            { id: '3', input: '123', shouldMatch: false },
          ],
        },
      ],
      candidates: [
        {
          id: 'sample-candidate',
          pattern: '^\\w+\\d*$',
          flags: '',
          score: 85,
          passRate: 85,
          failedCases: [],
          explanation: 'Sample pattern',
        },
      ],
    });
  },

  // Arena actions
  selectCandidate: (candidateId) => {
    const { candidates, benchmarks } = get();
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (candidate) {
      // Populate workbench with candidate data
      const allTestCases = benchmarks.flatMap(b => b.testCases);
      
      set({
        selectedCandidateId: candidateId,
        stage: 'workbench',
        workbenchPattern: candidate.pattern,
        workbenchFlags: candidate.flags,
        workbenchTests: allTestCases,
      });
    }
  },

  updateBenchmark: (benchmarkId, testCases) => {
    const { benchmarks } = get();
    const updatedBenchmarks = benchmarks.map(b =>
      b.id === benchmarkId ? { ...b, testCases } : b
    );
    
    set({ benchmarks: updatedBenchmarks });
    
    // Trigger rescore
    get().rescoreCandidates();
  },

  rescoreCandidates: () => {
    const { candidates, benchmarks } = get();
    
    const updatedCandidates = candidates.map(candidate => {
      const allTestCases = benchmarks.flatMap(b => b.testCases);
      const { passRate, failedCases } = calculatePassRate(
        candidate.pattern,
        candidate.flags,
        allTestCases
      );
      
      return {
        ...candidate,
        passRate,
        failedCases,
        score: passRate,
      };
    });
    
    set({ candidates: updatedCandidates });
  },

  // Workbench actions
  setWorkbenchPattern: (pattern) => set({ workbenchPattern: pattern }),
  
  setWorkbenchFlags: (flags) => set({ workbenchFlags: flags }),
  
  setWorkbenchTests: (tests) => set({ workbenchTests: tests }),

  openAIDrawer: () => set({ aiDrawerOpen: true }),
  
  closeAIDrawer: () => set({ aiDrawerOpen: false }),

  explainRegex: async () => {
    const { workbenchPattern, workbenchFlags } = get();
    
    set({ isLoadingAI: true });
    
    try {
      const response = await mockAI.explainRegex(workbenchPattern, workbenchFlags);
      set({
        aiDrawerContent: response.content,
        isLoadingAI: false,
        aiDrawerOpen: true,
      });
    } catch (error) {
      console.error('Error explaining regex:', error);
      set({ isLoadingAI: false });
    }
  },

  fixRegex: async (issue) => {
    const { workbenchPattern, workbenchFlags } = get();
    
    set({ isLoadingAI: true });
    
    try {
      const response = await mockAI.fixRegex(workbenchPattern, workbenchFlags, issue);
      set({
        aiDrawerContent: response.content,
        isLoadingAI: false,
        aiDrawerOpen: true,
      });
    } catch (error) {
      console.error('Error fixing regex:', error);
      set({ isLoadingAI: false });
    }
  },

  copyPattern: () => {
    const { workbenchPattern, workbenchFlags } = get();
    const fullPattern = `/${workbenchPattern}/${workbenchFlags}`;
    
    navigator.clipboard.writeText(fullPattern).catch(err => {
      console.error('Failed to copy:', err);
    });
  },

  // Reset
  reset: () => set({
    stage: 'portal',
    intent: '',
    benchmarks: [],
    candidates: [],
    selectedCandidateId: null,
    workbenchPattern: '',
    workbenchFlags: '',
    workbenchTests: [],
    aiDrawerOpen: false,
    aiDrawerContent: '',
  }),
}));

import { create } from 'zustand';
import { KeywordStatus } from '../lib/types';

interface DashboardState {
  // Tailor wizard
  tailorStep: 1 | 2 | 3 | 4;
  jobDescription: string;
  selectedResumeId: string | null;
  selectedKeywordId: string | null;
  keywordStatuses: Record<string, KeywordStatus>;
  
  // My Resumes
  resumeTab: 'all' | 'base' | 'tailored';
  resumeSearchQuery: string;
  
  // Analytics
  analyticsResumeId: string;
  
  // Job Hunt
  savedJobIds: string[];
  jobViewMode: 'find' | 'saved';
  jobResumeMode: 'base' | 'tailored';
  activeFilters: string[];
  
  // Settings
  activeSettingsSection: string;
  
  // Actions
  setTailorStep: (step: 1 | 2 | 3 | 4) => void;
  setJobDescription: (desc: string) => void;
  selectResume: (id: string | null) => void;
  selectKeyword: (id: string | null) => void;
  updateKeywordStatus: (id: string, status: KeywordStatus) => void;
  resetTailorWizard: () => void;
  
  setResumeTab: (tab: 'all' | 'base' | 'tailored') => void;
  setResumeSearch: (query: string) => void;
  
  setAnalyticsResume: (id: string) => void;
  
  toggleSaveJob: (id: string) => void;
  setJobViewMode: (mode: 'find' | 'saved') => void;
  setJobResumeMode: (mode: 'base' | 'tailored') => void;
  toggleFilter: (filter: string) => void;
  
  setSettingsSection: (section: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state — Tailor
  tailorStep: 1,
  jobDescription: '',
  selectedResumeId: null,
  selectedKeywordId: null,
  keywordStatuses: {},
  
  // Initial state — Resumes
  resumeTab: 'all',
  resumeSearchQuery: '',
  
  // Initial state — Analytics
  analyticsResumeId: 'r1',
  
  // Initial state — Job Hunt
  savedJobIds: [],
  jobViewMode: 'find',
  jobResumeMode: 'base',
  activeFilters: [],
  
  // Initial state — Settings
  activeSettingsSection: 'Profile',
  
  // Actions
  setTailorStep: (step) => set({ tailorStep: step }),
  setJobDescription: (desc) => set({ jobDescription: desc }),
  selectResume: (id) => set({ selectedResumeId: id }),
  selectKeyword: (id) => set({ selectedKeywordId: id }),
  updateKeywordStatus: (id, status) => set((state) => ({
    keywordStatuses: { ...state.keywordStatuses, [id]: status }
  })),
  resetTailorWizard: () => set({
    tailorStep: 1,
    jobDescription: '',
    selectedResumeId: null,
    selectedKeywordId: null,
    keywordStatuses: {}
  }),
  
  setResumeTab: (tab) => set({ resumeTab: tab }),
  setResumeSearch: (query) => set({ resumeSearchQuery: query }),
  
  setAnalyticsResume: (id) => set({ analyticsResumeId: id }),
  
  toggleSaveJob: (id) => set((state) => ({
    savedJobIds: state.savedJobIds.includes(id) 
      ? state.savedJobIds.filter(jobId => jobId !== id)
      : [...state.savedJobIds, id]
  })),
  setJobViewMode: (mode) => set({ jobViewMode: mode }),
  setJobResumeMode: (mode) => set({ jobResumeMode: mode }),
  toggleFilter: (filter) => set((state) => ({
    activeFilters: state.activeFilters.includes(filter)
      ? state.activeFilters.filter(f => f !== filter)
      : [...state.activeFilters, filter]
  })),
  
  setSettingsSection: (section) => set({ activeSettingsSection: section })
}));

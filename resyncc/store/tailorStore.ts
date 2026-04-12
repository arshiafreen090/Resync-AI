import { create } from 'zustand'
import {
  KeywordDecision,
  JDBreakdown,
  MatchSummary,
  ResumeSections,
  SessionOutput,
  SessionStatus
} from '@/types'

interface TailorStore {
  // Step 1 data
  selectedResumeId: string | null
  resumeFile: File | null
  resumeFileName: string | null
  jdText: string

  // Session
  sessionId: string | null
  sessionStatus: SessionStatus | null

  // Step 3 data
  jdBreakdown: JDBreakdown | null
  resumeSections: ResumeSections | null
  matchSummary: MatchSummary | null

  // Step 4 data
  keywords: KeywordDecision[]
  currentSection: string
  acceptedCount: number
  rejectedCount: number
  currentAtsScore: number

  // Step 5 data
  sessionOutput: SessionOutput | null

  // Actions
  setSelectedResume: (id: string | null) => void
  setResumeFile: (file: File | null) => void
  setResumeFileName: (name: string | null) => void
  setJdText: (text: string) => void
  setSessionId: (id: string | null) => void
  setSessionStatus: (status: SessionStatus | null) => void

  setJdBreakdown: (data: JDBreakdown | null) => void
  setResumeSections: (data: ResumeSections | null) => void
  setMatchSummary: (data: MatchSummary | null) => void

  setKeywords: (keywords: KeywordDecision[]) => void
  setCurrentSection: (section: string) => void
  updateKeywordDecision: (id: string, decision: Partial<KeywordDecision>) => void
  incrementAccepted: () => void
  incrementRejected: () => void
  updateAtsScore: (score: number) => void

  setSessionOutput: (output: SessionOutput | null) => void

  resetFlow: () => void
}

export const useTailorStore = create<TailorStore>((set) => ({
  // Defaults
  selectedResumeId: null,
  resumeFile: null,
  resumeFileName: null,
  jdText: '',

  sessionId: null,
  sessionStatus: null,

  jdBreakdown: null,
  resumeSections: null,
  matchSummary: null,

  keywords: [],
  currentSection: 'experience',
  acceptedCount: 0,
  rejectedCount: 0,
  currentAtsScore: 0,

  sessionOutput: null,

  // Setters
  setSelectedResume: (id) => set({ selectedResumeId: id }),
  setResumeFile: (file) => set({ resumeFile: file }),
  setResumeFileName: (name) => set({ resumeFileName: name }),
  setJdText: (text) => set({ jdText: text }),
  setSessionId: (id) => set({ sessionId: id }),
  setSessionStatus: (status) => set({ sessionStatus: status }),

  setJdBreakdown: (data) => set({ jdBreakdown: data }),
  setResumeSections: (data) => set({ resumeSections: data }),
  setMatchSummary: (data) => set({ matchSummary: data }),

  setKeywords: (keywords) => set({ keywords }),
  setCurrentSection: (section) => set({ currentSection: section }),
  
  updateKeywordDecision: (id, updates) =>
    set((state) => ({
      keywords: state.keywords.map((kw) =>
        kw.id === id ? { ...kw, ...updates } : kw
      ),
    })),
    
  incrementAccepted: () =>
    set((state) => ({ acceptedCount: state.acceptedCount + 1 })),
  incrementRejected: () =>
    set((state) => ({ rejectedCount: state.rejectedCount + 1 })),
  updateAtsScore: (score) => set({ currentAtsScore: score }),

  setSessionOutput: (output) => set({ sessionOutput: output }),

  resetFlow: () =>
    set({
      selectedResumeId: null,
      resumeFile: null,
      resumeFileName: null,
      jdText: '',
      sessionId: null,
      sessionStatus: null,
      jdBreakdown: null,
      resumeSections: null,
      matchSummary: null,
      keywords: [],
      currentSection: 'experience',
      acceptedCount: 0,
      rejectedCount: 0,
      currentAtsScore: 0,
      sessionOutput: null,
    }),
}))

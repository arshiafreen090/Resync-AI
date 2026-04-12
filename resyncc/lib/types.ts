export type KeywordStatus = 'matched' | 'contextual' | 'pending' | 'not-applicable' | 'modified' | 'rejected';

export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'reviewing'
  | 'finalizing'
  | 'complete'
  | 'failed';

/** Keyword shape returned by GET /v1/sessions/{id}/keywords */
export interface BackendKeyword {
  id: string;
  session_id: string;
  keyword: string;
  /** matched | modification | addition | contextual | not_applicable */
  match_type: string;
  /** accepted | rejected | null */
  user_decision: string | null;
  section: string | null;
  placement: string | null;
  original_bullet: string | null;
  modified_bullet: string | null;
  added_bullet: string | null;
  reasoning: string | null;
  clarifying_question: string | null;
  clarifying_answer: string | null;
}

export interface UploadedResume {
  id: string;
  name: string;
  base_ats_score: number;
  created_at: string | null;
}

export interface Keyword {
  id: string;
  name: string;
  status: KeywordStatus;
  placement: string;
  originalBullet?: string;
  rewrittenBullet?: string;
  clarifyingQuestion?: string;
  whyFlagged?: string;
  proposedAddition?: string;
}

export interface Resume {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  isBase: boolean;
  baseResumeId?: string;
  updatedAt: string;
  size?: string;
}

export interface Job {
  id: string;
  companyName: string;
  title: string;
  location: string;
  remote: boolean;
  fullTime: boolean;
  salary: string;
  matchPercentage: number;
  skills: string[];
  avatarInitial: string;
  avatarColorClass: string;
  postedAt: string;
}

export interface AnalyticsData {
  atsScore: number;
  history: { day: string; score: number }[];
  targetRole: string;
  targetIndustry: string;
  experienceLevel: string;
  topSkills: string[];
  jobsFit: { category: string; count: number; colorClass: string }[];
  tailoringSessions: { company: string; date: string; score: number; colorClass: string }[];
  missingSkills: { skill: string; importance: 'High' | 'Medium' | 'Low'; score: number }[];
}

export interface User {
  name: string;
  email: string;
  plan: 'Free' | 'Pro';
  targetRole: string;
  avatarInitial: string;
}

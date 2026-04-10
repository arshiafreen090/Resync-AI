export type KeywordStatus = 'matched' | 'contextual' | 'pending' | 'not-applicable' | 'modified' | 'rejected';

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

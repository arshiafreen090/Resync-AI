export interface Resume {
  id: string
  user_id: string
  name: string
  file_url: string
  parsed_json: any
  raw_text: string
  base_ats_score: number
  created_at: string
}

export type SessionStatus =
  | 'pending'
  | 'analyzing'
  | 'reviewing'
  | 'complete'
  | 'failed'
  | 'timed_out'

export interface TailoringSession {
  id: string
  user_id: string
  resume_id: string
  jd_text: string
  jd_parsed_json: JDBreakdown
  status: SessionStatus
  initial_ats_score: number | null
  final_ats_score: number | null
  created_at: string
  error_message?: string
}

export type MatchType =
  | 'contextual'
  | 'modification'
  | 'addition'
  | 'not_applicable'
  | 'matched'

export type DecisionType = 'pending' | 'accepted' | 'rejected'

export interface KeywordDecision {
  id: string
  session_id: string
  keyword: string
  match_type: MatchType
  user_decision: DecisionType
  original_bullet: string | null
  modified_bullet: string | null
  added_bullet: string | null
  reasoning: string | null
  placement: string | null
  section: string | null
  clarifying_question: string | null
  clarifying_answer: string | null
}

export interface JDBreakdown {
  role_target: {
    title: string
    company: string
    location: string
    work_type: string
    experience_required: string
  }
  must_have_skills: string[]
  good_to_have_skills: string[]
  key_responsibilities: string[]
  who_they_want: string
}

export interface MatchSummary {
  score: number
  total: number
  matched: number
  contextual: number
  missing: number
  not_applicable: number
}

export interface ResumeSections {
  personal: any
  education: any[]
  experience: any[]
  skills: string[]
  projects: any[]
  certifications: any[]
}

export interface SessionOutput {
  tailored_resume_json: any
  tailored_pdf_url: string | null
  tailored_docx_url: string | null
  pdf_generated_at: string | null
  created_at: string
}

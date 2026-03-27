'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock, Edit3, ChevronDown, CheckCircle2, ChevronUp } from 'lucide-react'
import StepIndicator from '@/components/tailor/StepIndicator'
import { useTailorStore } from '@/store/tailorStore'

const MOCK_JD_BREAKDOWN = {
  role_target: {
    title: "Senior Product Manager",
    company: "Google",
    location: "Bangalore, India",
    work_type: "Remote",
    experience_required: "3–5 years"
  },
  must_have_skills: [
    "Product Management", "SQL", "Python",
    "REST APIs", "Data Analysis"
  ],
  good_to_have_skills: [
    "Docker", "AWS", "Agile", "Figma"
  ],
  key_responsibilities: [
    "Build scalable backend services",
    "Lead cross-functional product teams",
    "Define and execute product roadmaps",
    "Analyze user data and drive decisions"
  ],
  who_they_want: "CS or engineering background, startup or big-tech experience, data-driven decision maker with strong communication."
}

export default function TailorPreviewPage() {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const { setJdBreakdown, setKeywords, sessionId } = useTailorStore()

  useEffect(() => {
    // Populate store directly
    setJdBreakdown(MOCK_JD_BREAKDOWN)
  }, [])

  const startTailoringFlow = () => {
    router.push('/tailor/keywords')
  }

  const jd = MOCK_JD_BREAKDOWN
  const matchScore = 62 // Initial starting point

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={2} title="Review Analysis" />

      <div className="two-panel-layout preview-phase">
        
        {/* LEFT PANEL */}
        <div className="tailor-panel panel-left-preview">
          <h2 className="panel-header uppercase-mono">YOUR RESUME</h2>
          <p className="subtext margin-b-20">Locked sections stay unchanged. Others will be improved.</p>

          <div className="section-card locked-card">
            <div className="section-header locked-header">
              <div className="flex-row-center gap-8">
                <Lock size={14} /> PERSONAL INFO
              </div>
              <span className="badge-locked">Locked</span>
            </div>
            <div className="section-content text-muted">
              John Doe · j.doe@gmail.com · San Francisco, CA · linkedin.com/in/jdoe
            </div>
          </div>

          <div className="section-card locked-card">
             <div className="section-header locked-header">
               <div className="flex-row-center gap-8">
                 <Lock size={14} /> EDUCATION
               </div>
               <span className="badge-locked">Locked</span>
             </div>
             <div className="section-content text-muted flex-col">
               <span>B.S. Computer Science, Stanford University</span>
               <span>M.S. Management, Columbia University</span>
             </div>
          </div>

          <div className="section-card authored-card">
             <div className="section-header authored-header" onClick={() => setExpandedSection(expandedSection === 'exp' ? null : 'exp')}>
                <div className="flex-row-center gap-8">
                  <Edit3 size={14} /> EXPERIENCE
                </div>
                <div className="flex-row-center gap-8">
                  <span className="badge-authored">Will be tailored</span>
                  {expandedSection === 'exp' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
             </div>
             <div className="section-content text-ink">
               <div className="font-medium margin-b-4">3 positions detected</div>
               <ul className="unstyled-list text-13">
                 <li>Senior Data Analyst at Stripe (2022-2024)</li>
                 <li>SWE Intern at Google (2021)</li>
                 <li>Product Intern at Flipkart (2020)</li>
               </ul>
             </div>
          </div>

          <div className="section-card authored-card">
             <div className="section-header authored-header" onClick={() => setExpandedSection(expandedSection === 'skills' ? null : 'skills')}>
                <div className="flex-row-center gap-8">
                  <Edit3 size={14} /> SKILLS
                </div>
                <div className="flex-row-center gap-8">
                  <span className="badge-authored">Will be tailored</span>
                  {expandedSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
             </div>
             <div className="section-content">
               <div className="font-medium margin-b-8">14 skills detected</div>
               <div className="skill-pills-row">
                 {['Python', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Kubernetes', 'Docker', '+7 more'].map(s => (
                   <span key={s} className="pill-outline">{s}</span>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="tailor-panel panel-right-preview">
          <h2 className="panel-header uppercase-mono">JOB DESCRIPTION</h2>
          <p className="subtext margin-b-20">Extracted from your pasted text.</p>

          <div className="jd-card role-target-card">
             <h3 className="instrument-title-22 white margin-b-6">{jd.role_target.title}</h3>
             <div className="text-13 opacity-70 flex-col gap-4">
               <span>{jd.role_target.company} · {jd.role_target.location} · {jd.role_target.work_type}</span>
               <span>Requires {jd.role_target.experience_required} experience</span>
             </div>
          </div>

          <div className="jd-card must-have-card">
            <h4 className="card-header text-green-dark">✅ Must Have Skills</h4>
            <div className="flex-col gap-8">
               {jd.must_have_skills.map(skill => (
                 <div key={skill} className="flex-between">
                   <div className="flex-row-center gap-8"><div className="green-dot"/> <span className="text-14-medium">{skill}</span></div>
                   <span className="badge-req">required</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="jd-card good-have-card">
             <h4 className="card-header text-orange-dark">⭐ Good to Have</h4>
             <div className="flex-col gap-8">
                {jd.good_to_have_skills.map(skill => (
                  <div key={skill} className="flex-between">
                    <div className="flex-row-center gap-8"><div className="orange-dot-hollow"/> <span className="text-14-medium">{skill}</span></div>
                    <span className="badge-pref">preferred</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="jd-card resp-card">
            <h4 className="card-header text-muted-uppercase">📋 Key Responsibilities</h4>
            <ul className="resp-list">
              {jd.key_responsibilities.map((r, i) => (
                <li key={i}>→ {r}</li>
              ))}
            </ul>
          </div>

          <div className="jd-card score-card">
             <h4 className="card-header transparent-white">📊 Your Current Match Score</h4>
             <div className="score-display">
               <span className="instrument-score-large">{matchScore}</span>
               <span className="score-denominator"> / 100</span>
             </div>

             <div className="progress-bar-container-white margin-y-12">
               <div className="progress-bar-fill-white" style={{ width: `${matchScore}%` }} />
             </div>

             <div className="stats-row-white">
               <span>24 keywords detected</span> · <span>12 matched</span> · <span>8 contextual</span> · <span>4 missing</span>
             </div>
             
             <p className="text-13 opacity-50 italic margin-t-8">Score will improve as you accept changes</p>
          </div>
        </div>
      </div>

      <div className="sticky-bottom-action-bar flex-between">
        <button className="back-btn-text" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>

        <button className="btn-blue-filled" onClick={startTailoringFlow}>
          Start Tailoring →
        </button>
      </div>

    </div>
  )
}

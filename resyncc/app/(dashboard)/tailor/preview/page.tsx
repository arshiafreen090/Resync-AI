'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronUp, Edit3, Lock, Loader2 } from 'lucide-react'
import StepIndicator from '@/components/tailor/StepIndicator'
import { useTailorStore } from '@/store/tailorStore'
import { apiCall } from '@/lib/api'
import type { JDBreakdown, MatchSummary } from '@/types'

export default function TailorPreviewPage() {
  const router = useRouter()
  const { sessionId, jdBreakdown, matchSummary, setJdBreakdown, setMatchSummary } = useTailorStore()

  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [loading, setLoading] = useState(!jdBreakdown) // Only fetch if store is empty
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      router.replace('/tailor')
      return
    }

    // If the loading page already loaded data into the store, we're done
    if (jdBreakdown && matchSummary) {
      setLoading(false)
      return
    }

    // Fallback: fetch directly (e.g. if user refreshed the page)
    apiCall(`/sessions/${sessionId}/result`)
      .then((data) => {
        if (data.jd_breakdown) setJdBreakdown(data.jd_breakdown)
        if (data.match_summary) setMatchSummary(data.match_summary)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (!sessionId) return null
  if (loading) {
    return (
      <div className="loading-center">
        <Loader2 size={40} className="spinner" color="var(--blue)" />
        <p className="subtext-muted margin-t-16">Loading analysis results...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="loading-center">
        <p className="text-red margin-b-16">{error}</p>
        <button className="btn-ink-pill" onClick={() => router.push('/tailor')}>Start Over →</button>
      </div>
    )
  }

  const jd = jdBreakdown
  const ms = matchSummary
  const matchScore = ms ? Math.round((ms.matched / Math.max(ms.total, 1)) * 100) : 0

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={2} title="Review Analysis" />

      <div className="two-panel-layout preview-phase">

        {/* LEFT PANEL — Resume sections */}
        <div className="tailor-panel panel-left-preview">
          <h2 className="panel-header uppercase-mono">YOUR RESUME</h2>
          <p className="subtext margin-b-20">Locked sections stay unchanged. Others will be improved.</p>

          <div className="section-card locked-card">
            <div className="section-header locked-header">
              <div className="flex-row-center gap-8"><Lock size={14} /> PERSONAL INFO</div>
              <span className="badge-locked">Locked</span>
            </div>
            <div className="section-content text-muted">
              Your name, email, and contact details are preserved exactly.
            </div>
          </div>

          <div className="section-card locked-card">
            <div className="section-header locked-header">
              <div className="flex-row-center gap-8"><Lock size={14} /> EDUCATION</div>
              <span className="badge-locked">Locked</span>
            </div>
            <div className="section-content text-muted">
              Degree, institution, and graduation year are never changed.
            </div>
          </div>

          <div className="section-card authored-card">
            <div className="section-header authored-header" onClick={() => setExpandedSection(expandedSection === 'exp' ? null : 'exp')}>
              <div className="flex-row-center gap-8"><Edit3 size={14} /> EXPERIENCE</div>
              <div className="flex-row-center gap-8">
                <span className="badge-authored">Will be tailored</span>
                {expandedSection === 'exp' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expandedSection === 'exp' && (
              <div className="section-content text-ink">
                Bullet points will be reworded to naturally include missing keywords. Your actual experience is never changed.
              </div>
            )}
          </div>

          <div className="section-card authored-card">
            <div className="section-header authored-header" onClick={() => setExpandedSection(expandedSection === 'skills' ? null : 'skills')}>
              <div className="flex-row-center gap-8"><Edit3 size={14} /> SKILLS</div>
              <div className="flex-row-center gap-8">
                <span className="badge-authored">Will be tailored</span>
                {expandedSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expandedSection === 'skills' && (
              <div className="section-content">
                Matched keywords from the JD will be added to your skills if they aren't there already.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — JD Breakdown */}
        <div className="tailor-panel panel-right-preview">
          <h2 className="panel-header uppercase-mono">JOB DESCRIPTION</h2>
          <p className="subtext margin-b-20">Extracted from your pasted text.</p>

          {jd ? (
            <>
              <div className="jd-card role-target-card">
                <h3 className="instrument-title-22 white margin-b-6">{jd.role_target?.title || 'Role'}</h3>
                <div className="text-13 opacity-70 flex-col gap-4">
                  <span>{jd.role_target?.company} · {jd.role_target?.location} · {jd.role_target?.work_type}</span>
                  <span>Requires {jd.role_target?.experience_required}</span>
                </div>
              </div>

              {jd.must_have_skills?.length > 0 && (
                <div className="jd-card must-have-card">
                  <h4 className="card-header text-green-dark">✅ Must Have Skills</h4>
                  <div className="flex-col gap-8">
                    {jd.must_have_skills.map((skill) => (
                      <div key={skill} className="flex-between">
                        <div className="flex-row-center gap-8"><div className="green-dot" /> <span className="text-14-medium">{skill}</span></div>
                        <span className="badge-req">required</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {jd.good_to_have_skills?.length > 0 && (
                <div className="jd-card good-have-card">
                  <h4 className="card-header text-orange-dark">⭐ Good to Have</h4>
                  <div className="flex-col gap-8">
                    {jd.good_to_have_skills.map((skill) => (
                      <div key={skill} className="flex-between">
                        <div className="flex-row-center gap-8"><div className="orange-dot-hollow" /> <span className="text-14-medium">{skill}</span></div>
                        <span className="badge-pref">preferred</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="jd-card score-card">
                <h4 className="card-header transparent-white">📊 Current Match Score</h4>
                <div className="score-display">
                  <span className="instrument-score-large">{ms?.matched ?? 0}</span>
                  <span className="score-denominator"> / {ms?.total ?? '?'} keywords matched</span>
                </div>
                <div className="progress-bar-container-white margin-y-12">
                  <div className="progress-bar-fill-white" style={{ width: `${matchScore}%` }} />
                </div>
                <div className="stats-row-white">
                  <span>{ms?.matched ?? 0} matched</span> ·
                  <span>{ms?.contextual ?? 0} contextual</span> ·
                  <span>{ms?.missing ?? 0} missing</span>
                </div>
                <p className="text-13 opacity-50 italic margin-t-8">Score will improve as you accept keyword changes</p>
              </div>
            </>
          ) : (
            <div className="text-muted text-14">No JD breakdown available.</div>
          )}
        </div>
      </div>

      <div className="sticky-bottom-action-bar flex-between">
        <button className="back-btn-text" onClick={() => router.back()}>
          <ArrowLeft size={16} /> Back
        </button>
        <button className="btn-blue-filled" onClick={() => router.push('/tailor/keywords')}>
          Start Keyword Review →
        </button>
      </div>
    </div>
  )
}

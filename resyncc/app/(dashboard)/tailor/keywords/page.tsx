'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Edit2, Loader2, Wand2, X } from 'lucide-react'
import StepIndicator from '@/components/tailor/StepIndicator'
import SectionProgress from '@/components/tailor/SectionProgress'
import { useTailorStore } from '@/store/tailorStore'
import { apiCall } from '@/lib/api'
import type { KeywordDecision } from '@/types'
import { CheckCircle2 } from 'lucide-react'

const SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'done', label: 'Done' },
]

export default function KeywordReviewPage() {
  const router = useRouter()
  const { sessionId } = useTailorStore()

  const [keywords, setKeywords] = useState<KeywordDecision[]>([])
  const [activeSection, setActiveSection] = useState('experience')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shakingId, setShakingId] = useState<string | null>(null)
  const [finalizingId, setFinalizingId] = useState<string | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const answerRefs = useRef<Record<string, string>>({})

  useEffect(() => {
    if (!sessionId) {
      router.replace('/tailor')
      return
    }

    apiCall(`/sessions/${sessionId}/keywords`)
      .then((data) => setKeywords(data.keywords))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  const sendDecision = async (
    id: string,
    decision: 'accepted' | 'rejected',
    answer?: string,
  ) => {
    const kw = keywords.find((k) => k.id === id)
    if (!kw) return

    // Contextual requires answer
    if (decision === 'accepted' && kw.match_type === 'contextual') {
      const ans = answer || answerRefs.current[id] || ''
      if (!ans.trim()) {
        setShakingId(id)
        setTimeout(() => setShakingId(null), 500)
        return
      }
    }

    setFinalizingId(id)
    try {
      await apiCall(`/sessions/${sessionId}/keywords/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          decision,
          clarifying_answer: answer || answerRefs.current[id] || null,
        }),
      })

      // Animate out, then update state
      const cardEl = document.getElementById(`kw-card-${id}`)
      if (cardEl) {
        cardEl.classList.add(decision === 'accepted' ? 'anim-accept' : 'anim-reject')
        setTimeout(() => {
          setKeywords((prev) =>
            prev.map((k) =>
              k.id === id ? { ...k, user_decision: decision } : k,
            ),
          )
        }, 300)
      } else {
        setKeywords((prev) =>
          prev.map((k) => (k.id === id ? { ...k, user_decision: decision } : k)),
        )
      }
    } catch (err: any) {
      console.error('Decision failed:', err.message)
    } finally {
      setFinalizingId(null)
    }
  }

  const handleFixWithAI = async (id: string) => {
    const cardEl = document.getElementById(`kw-card-${id}`)
    if (cardEl) cardEl.classList.add('ai-loading')

    try {
      // Re-fetch keywords after AI reclassification (backend would update)
      // For now: treat as a modification with a new modified_bullet
      setKeywords((prev) =>
        prev.map((k) =>
          k.id === id
            ? { ...k, match_type: 'modification', modified_bullet: 'AI is regenerating this suggestion. Please refresh or wait.' }
            : k,
        ),
      )
    } finally {
      if (cardEl) cardEl.classList.remove('ai-loading')
    }
  }

  const handleFinishReview = async () => {
    setIsFinalizing(true)
    try {
      await apiCall(`/sessions/${sessionId}/finalize`, { method: 'POST' })
      router.push('/tailor/loading?step=finalize')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleNextSection = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection)
    if (idx < SECTIONS.length - 1) {
      const next = SECTIONS[idx + 1]
      setActiveSection(next.id)
      if (next.id === 'done') {
        handleFinishReview()
      }
    }
  }

  const sectionKeywords = keywords.filter(
    (k) => k.section === activeSection && k.user_decision === 'pending',
  )
  const isSectionComplete = sectionKeywords.length === 0

  const totalDecided = keywords.filter((k) => k.user_decision !== 'pending').length
  const progressPercent =
    keywords.length > 0 ? (totalDecided / keywords.length) * 100 : 0
  const rejectedCount = keywords.filter((k) => k.user_decision === 'rejected').length

  if (loading) {
    return (
      <div className="loading-center">
        <Loader2 size={40} className="spinner" color="var(--blue)" />
        <p className="subtext-muted margin-t-16">Loading keyword decisions...</p>
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

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={3} title="Keyword Review" />

      <SectionProgress
        sections={SECTIONS.map((s) => ({
          ...s,
          status: activeSection === s.id ? 'active' : 'upcoming',
        }))}
        currentSection={activeSection}
        onSectionClick={(id) => setActiveSection(id)}
      />

      <div className="current-section-header">
        <div className="text-14-semi">Reviewing: {activeSection.toUpperCase()}</div>
      </div>

      <div className="keyword-cards-container">
        {isSectionComplete && activeSection !== 'done' && (
          <div className="section-complete-banner">
            <CheckCircle2 size={48} color="var(--green)" className="margin-b-16" />
            <h3 className="instrument-title-28 margin-b-24">Section Complete ✓</h3>
            <button className="btn-blue-filled" onClick={handleNextSection}>
              Continue to Next Section →
            </button>
          </div>
        )}

        {sectionKeywords.map((kw) => {
          const isProcessing = finalizingId === kw.id

          if (kw.match_type === 'contextual') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-contextual">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">NEEDS YOUR CONFIRMATION</div>
                    <div className="kw-title-flex"><div className="orange-dot-pulse" /> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge orange">◎ CONTEXTUAL MATCH</div>
                </div>
                {kw.placement && <div className="kw-placement">PLACEMENT: {kw.placement}</div>}
                <hr className="kw-divider" />
                <div className="kw-box beige">
                  <div className="font-bold-12 ink margin-b-6">Clarifying Question:</div>
                  <div className="text-14 muted">{kw.clarifying_question}</div>
                </div>
                <textarea
                  className={`kw-textarea ${shakingId === kw.id ? 'shake-anim' : ''}`}
                  placeholder="Describe your experience with this keyword..."
                  onChange={(e) => { answerRefs.current[kw.id] = e.target.value }}
                />
                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => sendDecision(kw.id, 'rejected')} disabled={isProcessing}>
                    <X size={14} /> Reject
                  </button>
                  <div className="flex-row-center gap-10">
                    <button className="btn-outline-blue" onClick={() => handleFixWithAI(kw.id)} disabled={isProcessing}>
                      <Wand2 size={14} /> Fix with AI
                    </button>
                    <button
                      className="btn-blue-filled"
                      onClick={() => sendDecision(kw.id, 'accepted', answerRefs.current[kw.id] || '')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 size={14} className="spinner" /> : 'Yes →'}
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          if (kw.match_type === 'modification') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-modification">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">BULLET REWRITE</div>
                    <div className="kw-title-flex"><div className="blue-dot" /> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge blue">✎ MODIFICATION</div>
                </div>
                {kw.placement && <div className="kw-placement">PLACEMENT: {kw.placement}</div>}

                <div className="kw-box grey margin-b-12">
                  <div className="font-bold-11 uppercase muted margin-b-8">Original:</div>
                  <div className="text-14 italic muted">{kw.original_bullet}</div>
                </div>

                <div className="kw-box blue-tint margin-b-16">
                  <div className="flex-row-center gap-8 margin-b-8">
                    <CheckCircle2 size={14} color="var(--blue)" />
                    <div className="font-bold-11 uppercase blue-text">Modified Version</div>
                  </div>
                  <div className="text-14 ink">{kw.modified_bullet}</div>
                </div>

                {kw.reasoning && (
                  <div className="kw-reasoning">
                    <div className="font-bold-10 uppercase muted margin-b-6">REASONING:</div>
                    <div className="text-13 muted">{kw.reasoning}</div>
                  </div>
                )}

                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => sendDecision(kw.id, 'rejected')} disabled={isProcessing}>
                    <X size={14} /> Reject
                  </button>
                  <div className="flex-row-center gap-10">
                    <button className="btn-blue-filled" onClick={() => sendDecision(kw.id, 'accepted')} disabled={isProcessing}>
                      {isProcessing ? <Loader2 size={14} className="spinner" /> : <><Check size={14} /> Accept</>}
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          if (kw.match_type === 'addition') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-addition">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">NEW BULLET POINT</div>
                    <div className="kw-title-flex"><div className="purple-dot" /> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge purple">+ ADDITION</div>
                </div>

                <div className="kw-box green-tint margin-b-16">
                  <div className="font-bold-11 uppercase green-text margin-b-8">+ New Bullet:</div>
                  <div className="text-14 ink">{kw.added_bullet}</div>
                </div>

                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => sendDecision(kw.id, 'rejected')} disabled={isProcessing}>
                    <X size={14} /> Reject
                  </button>
                  <button className="btn-green-filled" onClick={() => sendDecision(kw.id, 'accepted')} disabled={isProcessing}>
                    {isProcessing ? <Loader2 size={14} className="spinner" /> : <><Check size={14} /> Accept Addition</>}
                  </button>
                </div>
              </div>
            )
          }

          if (kw.match_type === 'not_applicable') {
            return (
              <div key={kw.id} id={`kw-card-${kw.id}`} className="kw-card type-not_applicable">
                <div className="kw-header-row">
                  <div>
                    <div className="kw-label-muted">NOT IN YOUR BACKGROUND</div>
                    <div className="kw-title-flex"><div className="red-dot" /> {kw.keyword}</div>
                  </div>
                  <div className="kw-badge red">⊗ NOT APPLICABLE</div>
                </div>

                {kw.reasoning && (
                  <div className="kw-box grey margin-b-16">
                    <div className="font-bold-12 ink margin-b-6">Why:</div>
                    <div className="text-14 muted">{kw.reasoning}</div>
                  </div>
                )}

                <div className="kw-action-row">
                  <button className="btn-outline-red" onClick={() => sendDecision(kw.id, 'rejected')} disabled={isProcessing}>
                    <X size={14} /> Skip
                  </button>
                  <button className="btn-outline-blue" onClick={() => handleFixWithAI(kw.id)} disabled={isProcessing}>
                    <Wand2 size={14} /> Try AI Alternative
                  </button>
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      <div className="sticky-bottom-progress-bar">
        <div className="flex-between margin-b-10">
          <span className="text-14-semi">Keywords Reviewed: {totalDecided} / {keywords.length}</span>
          <div className="pill-tabs flex-row-center gap-8">
            <span className="pill-tab active">Pending {keywords.length - totalDecided}</span>
            <span className="pill-tab-muted">Accepted {totalDecided - rejectedCount}</span>
            <span className="pill-tab-muted">Rejected {rejectedCount}</span>
          </div>
        </div>
        <div className="progress-bar-container margin-b-10">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex-between muted text-13">
          <button className="btn-text-muted" disabled>← Previous</button>
          <span>Section {SECTIONS.findIndex((s) => s.id === activeSection) + 1} of {SECTIONS.length}</span>
          <button className="btn-text-blue" disabled={!isSectionComplete} onClick={handleNextSection}>
            {isFinalizing ? <Loader2 size={14} className="spinner" /> : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  )
}

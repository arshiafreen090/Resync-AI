'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { useTailorStore } from '@/store/tailorStore'
import { apiCall } from '@/lib/api'

const STEPS = [
  'Extracting resume sections',
  'Parsing job description',
  'Identifying keyword matches',
  'Calculating ATS score',
  'Generating improvement plan',
]

export default function TailorLoadingPage() {
  const router = useRouter()
  const { sessionId, setJdBreakdown, setMatchSummary, setSessionStatus } = useTailorStore()

  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const animRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!sessionId) {
      router.replace('/tailor')
      return
    }

    // Animate progress bar (decelerates near 90% until real completion)
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p // Hold at 90 until real completion
        return p + 1
      })
    }, 300)

    // Cycle through step labels at ~6s each
    let stepTimers: NodeJS.Timeout[] = STEPS.map((_, i) =>
      setTimeout(() => setActiveStepIdx(i), i * 6000)
    )

    // Poll the backend every 2 seconds
    const poll = async () => {
      try {
        const data = await apiCall(`/sessions/${sessionId}/status`)
        setSessionStatus(data.status)

        if (data.status === 'reviewing') {
          // Success — fetch result and navigate
          clearInterval(progressInterval)
          stepTimers.forEach(clearTimeout)

          const result = await apiCall(`/sessions/${sessionId}/result`)
          if (result.jd_breakdown) setJdBreakdown(result.jd_breakdown)
          if (result.match_summary) setMatchSummary(result.match_summary)

          setProgress(100)
          setDone(true)
          setTimeout(() => router.push('/tailor/preview'), 700)

        } else if (data.status === 'failed' || data.status === 'timed_out') {
          clearInterval(progressInterval)
          stepTimers.forEach(clearTimeout)
          setError(data.error_message || 'Analysis failed. Please try again.')
        }
        // else: still analyzing — keep polling
      } catch (err: any) {
        clearInterval(progressInterval)
        stepTimers.forEach(clearTimeout)
        setError(err.message || 'Network error while checking status')
      }
    }

    // Start polling immediately, then every 2s
    poll()
    pollingRef.current = setInterval(poll, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(pollingRef.current!)
      stepTimers.forEach(clearTimeout)
    }
  }, [sessionId])

  if (error) {
    return (
      <div className="loading-center">
        <XCircle size={56} color="var(--red, #ef4444)" className="mb-4" />
        <h2 className="instrument-title-32 margin-b-8">Analysis Failed</h2>
        <p className="subtext-muted margin-b-32">{error}</p>
        <button className="btn-ink-pill" onClick={() => router.push('/tailor')}>
          Try Again →
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="loading-center">
        <CheckCircle2 size={56} color="var(--green)" className="pulse-once" />
        <h2 className="instrument-title-28 margin-t-16">Analysis Complete!</h2>
        <p className="subtext-muted">Redirecting to results...</p>
      </div>
    )
  }

  return (
    <div className="loading-center">
      <div className="loading-icon-pulse margin-b-16">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2L2 12l10 10 10-10L12 2zM12 22v-10" />
        </svg>
      </div>

      <h2 className="instrument-title-32 margin-b-8">Analyzing your resume...</h2>
      <p className="subtext-muted margin-b-48">This usually takes 10–30 seconds</p>

      <div className="steps-list">
        {STEPS.map((step, idx) => {
          const isPending = idx > activeStepIdx
          const isActive = idx === activeStepIdx
          const isDone = idx < activeStepIdx

          return (
            <div key={idx} className={`step-row ${isPending ? 'pending' : isActive ? 'active' : 'done'}`}>
              <div className="step-icon-wrapper">
                {isPending && <Clock size={16} color="rgba(14,12,10,0.3)" />}
                {isActive && <Loader2 size={16} color="var(--blue)" className="spinner" />}
                {isDone && <CheckCircle2 size={16} color="var(--green)" />}
              </div>
              <span className={`step-text ${isDone ? 'done-text' : isActive ? 'active-text' : 'pending-text'}`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>

      <div className="progress-bar-container margin-t-32">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        />
      </div>
    </div>
  )
}

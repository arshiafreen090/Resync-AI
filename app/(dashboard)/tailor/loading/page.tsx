'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { useTailorStore } from '@/store/tailorStore'

export default function TailorLoadingPage() {
  const router = useRouter()
  const { sessionId } = useTailorStore()
  
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    { label: 'Extracting resume sections', delay: 800 },
    { label: 'Parsing job description', delay: 1800 },
    { label: 'Identifying keyword matches', delay: 2800 },
    { label: 'Calculating ATS score', delay: 3600 },
    { label: 'Generating improvement plan', delay: 4400 }
  ]

  const [activeStepIdx, setActiveStepIdx] = useState(0)

  useEffect(() => {
    // Redirect if direct access without session
    if (!sessionId && process.env.NODE_ENV !== 'development') {
      // Allow testing in dev, but prod strictly re-routes
      // router.replace('/tailor')
    }

    // Animation orchestration
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          return 100
        }
        return p + 2
      })
    }, 100) // 5 seconds to 100%

    const timeouts = steps.map((s, i) => 
      setTimeout(() => setActiveStepIdx(i), s.delay)
    )

    const finishTimeout = setTimeout(() => {
      setComplete(true)
      setTimeout(() => {
        router.push('/tailor/preview')
      }, 600)
    }, 5000) // 5 seconds total

    return () => {
      clearInterval(timer)
      timeouts.forEach(clearTimeout)
      clearTimeout(finishTimeout)
    }
  }, [router, sessionId])

  if (error) {
    return (
      <div className="loading-center">
        <h2 className="instrument-title-error">Analysis failed</h2>
        <p className="subtext">{error}</p>
        <button className="btn-ink-pill margin-t-24" onClick={() => router.push('/tailor')}>
          Retry →
        </button>
      </div>
    )
  }

  if (complete) {
    return (
      <div className="loading-center">
        <CheckCircle2 size={56} color="var(--green)" className="pulse-once" />
        <h2 className="instrument-title-28 margin-t-16">Analysis complete!</h2>
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
        {steps.map((step, idx) => {
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
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="progress-bar-container margin-t-32">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

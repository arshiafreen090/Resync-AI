'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StepIndicator from '@/components/tailor/StepIndicator'
import ATSScoreRing from '@/components/resume/ATSScoreRing'
import { FileText, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { useTailorStore } from '@/store/tailorStore'
import { apiCall } from '@/lib/api'

export default function TailorEditorPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const { sessionId, resetFlow } = useTailorStore()

  const [isExporting, setIsExporting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tailored, setTailored] = useState<any>(null)
  const [scores, setScores] = useState({ initial: 0, final: 0 })

  useEffect(() => {
    if (!sessionId) {
      router.replace('/tailor')
      return
    }

    // Poll for completion if still finalizing
    const poll = async () => {
      try {
        const status = await apiCall(`/sessions/${sessionId}/status`)
        if (status.status === 'complete') {
          const data = await apiCall(`/sessions/${sessionId}/tailored-resume`)
          setTailored(data.tailored_resume)
          setScores({
            initial: data.initial_ats_score || 0,
            final: data.final_ats_score || 0,
          })
          setLoading(false)
        } else if (status.status === 'failed') {
          setError(status.error_message || 'Finalization failed')
          setLoading(false)
        } else {
          // Still processing — keep polling
          setTimeout(poll, 2000)
        }
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    poll()
  }, [sessionId])

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    showToast('Generating PDF...', 'info')
    try {
      const data = await apiCall(`/sessions/${sessionId}/download-pdf`)
      // Open signed URL — triggers browser download
      window.open(data.url, '_blank')
      showToast('PDF downloaded successfully!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to generate PDF', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const handleStartOver = () => {
    resetFlow()
    router.push('/tailor')
  }

  // Render helpers
  const renderExperience = (experience: any[] = [], isOriginal = false) => (
    experience.map((job, idx) => (
      <div key={idx}>
        <div className="paper-job-title">{job.title} at {job.company}</div>
        <div className="paper-job-meta">{job.dates} {job.location && `· ${job.location}`}</div>
        <ul className="paper-bullets">
          {(job.bullets || []).map((bullet: string, bi: number) => (
            <li key={bi}>{bullet}</li>
          ))}
        </ul>
      </div>
    ))
  )

  if (loading) {
    return (
      <div className="loading-center">
        <Loader2 size={40} className="spinner" color="var(--blue)" />
        <h2 className="instrument-title-28 margin-t-16">Assembling your tailored resume...</h2>
        <p className="subtext-muted">Applying accepted changes · Usually takes 10–20 seconds</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-center">
        <p className="text-red margin-b-16">{error}</p>
        <button className="btn-ink-pill" onClick={() => router.push('/tailor/keywords')}>
          Go Back to Review →
        </button>
      </div>
    )
  }

  const basic = tailored?.basic_info || {}
  const contactLine = [basic.email, basic.phone, basic.location, basic.linkedin]
    .filter(Boolean).join(' · ')

  return (
    <div className="tailor-flow-wrapper">
      <StepIndicator currentStep={4} title="Review & Export" />

      <div className="editor-three-col-grid margin-t-24">

        {/* COLUMN 1: Original (from raw_text preview) */}
        <div className="editor-col">
          <div className="sticky-pill-header pill-original">ORIGINAL</div>
          <div className="resume-paper-card">
            <div className="paper-name">{basic.name || 'Your Name'}</div>
            <div className="paper-contact text-muted">Original version of your resume</div>
            <div className="paper-section-header">EXPERIENCE</div>
            <p className="text-13 muted italic">Your original bullets are preserved in the tailored version as a baseline.</p>
          </div>
        </div>

        {/* COLUMN 2: Tailored */}
        <div className="editor-col">
          <div className="sticky-pill-header pill-tailored">TAILORED ✓ Live</div>
          <div className="resume-paper-card">
            <div className="paper-name">{basic.name || 'Your Name'}</div>
            {contactLine && <div className="paper-contact">{contactLine}</div>}

            {tailored?.summary && (
              <>
                <div className="paper-section-header">SUMMARY</div>
                <p className="paper-summary">{tailored.summary}</p>
              </>
            )}

            {tailored?.experience?.length > 0 && (
              <>
                <div className="paper-section-header">EXPERIENCE</div>
                {renderExperience(tailored.experience)}
              </>
            )}

            {tailored?.skills?.length > 0 && (
              <>
                <div className="paper-section-header">SKILLS</div>
                <p className="text-13">{tailored.skills.join(' · ')}</p>
              </>
            )}

            {tailored?.education?.length > 0 && (
              <>
                <div className="paper-section-header">EDUCATION</div>
                {tailored.education.map((edu: any, i: number) => (
                  <div key={i} className="text-13">
                    {edu.degree} — {edu.institution}{edu.year ? `, ${edu.year}` : ''}
                  </div>
                ))}
              </>
            )}

            {tailored?.projects?.length > 0 && (
              <>
                <div className="paper-section-header">PROJECTS</div>
                {tailored.projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="paper-job-title">{proj.name}</div>
                    <p className="text-13">{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <p className="text-12 muted">{proj.technologies.join(', ')}</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* COLUMN 3: Export */}
        <div className="editor-export-col">
          <div className="export-card-white">
            <h3 className="uppercase-label margin-b-16">ATS SCORE</h3>

            {scores.initial > 0 && (
              <div className="text-10-muted text-center margin-b-4">
                Before: {scores.initial}
              </div>
            )}

            <div className="flex-col-center margin-b-16">
              <ATSScoreRing
                score={scores.final}
                size={120}
                animated={true}
                showLabel={false}
              />
            </div>

            <div className="flex-col-center margin-b-24">
              {scores.final > scores.initial && (
                <div className="green-pill-large margin-b-12">
                  +{scores.final - scores.initial} pts
                </div>
              )}
              <div className="text-13-semi">ATS Score: {scores.final} / 100</div>
            </div>

            <hr className="divider-card margin-b-16" />

            <button
              className="btn-export-pdf"
              onClick={handleDownloadPDF}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 size={16} className="spinner" /> : <FileText size={16} />}
              {isExporting ? 'Generating...' : 'Download PDF'}
            </button>

            <hr className="divider-card margin-b-16" />

            <div className="flex-col-center">
              <button className="tailor-another-link" onClick={handleStartOver}>
                Tailor for another job →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

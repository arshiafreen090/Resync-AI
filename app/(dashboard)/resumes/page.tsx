'use client'

import { useRouter } from 'next/navigation'
import { FileText, Upload } from 'lucide-react'
import ATSScoreRing from '@/components/resume/ATSScoreRing'
import { useTailorStore } from '@/store/tailorStore'

export default function MyResumesPage() {
  const router = useRouter()
  const setSelectedResume = useTailorStore(state => state.setSelectedResume)

  const handleTailorNew = () => {
    setSelectedResume(null)
    router.push('/tailor')
  }

  const handleTailorExisting = (id: string) => {
    setSelectedResume(id)
    router.push('/tailor')
  }

  // Mock
  const resumes = [
    {
      id: '1',
      name: 'Google_SWE_Final.pdf',
      type: 'PDF',
      date: 'Mar 5, 2026',
      size: '284KB',
      score: 87,
      sessions: 5,
      lastTailored: '2 days ago',
      skillsCount: 42
    },
    {
      id: '2',
      name: 'Startup_General.docx',
      type: 'DOCX',
      date: 'Feb 12, 2026',
      size: '142KB',
      score: 64,
      sessions: 1,
      lastTailored: '1 month ago',
      skillsCount: 28
    }
  ]

  return (
    <div className="dashboard-content">
      <div className="dashboard-header flex-row-between margin-b-32">
        <h1 className="page-title-large">My Resumes</h1>
        <button className="btn-ink-pill" onClick={handleTailorNew}>
          Upload New +
        </button>
      </div>

      <div className="resumes-grid">
        {resumes.map(res => (
          <div key={res.id} className="resume-card">
            
            <div className="resume-card-top">
              <span className="file-type-badge">{res.type}</span>
              <FileText size={48} color="var(--ink)" className="margin-b-12" />
              <div className="resume-name">{res.name}</div>
              <div className="resume-info">{res.date} · {res.type} · {res.size}</div>
            </div>

            <div className="resume-card-score">
              <div className="score-label">ATS Score</div>
              <ATSScoreRing score={res.score} size={100} />
            </div>

            <div className="resume-card-stats">
              <span>{res.sessions} Sessions</span>
              <span>{res.lastTailored}</span>
              <span>{res.skillsCount} Skills</span>
            </div>

            <div className="resume-card-actions">
              <button className="btn-outline-pill" onClick={() => router.push(`/resumes/${res.id}`)}>
                View Details
              </button>
              <button className="btn-blue-pill" onClick={() => handleTailorExisting(res.id)}>
                Tailor This →
              </button>
            </div>
            
          </div>
        ))}

        <div className="upload-new-card" onClick={handleTailorNew}>
          <Upload size={48} color="rgba(14,12,10,0.4)" className="margin-b-12" />
          <div className="upload-title">Upload New Resume</div>
          <div className="upload-sub">PDF or DOCX · Max 5MB</div>
        </div>
      </div>
    </div>
  )
}

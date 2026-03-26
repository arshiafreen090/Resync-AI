'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, FileText, Upload } from 'lucide-react'
import ATSScoreRing from '@/components/resume/ATSScoreRing'
import { useTailorStore } from '@/store/tailorStore'

export default function ResumeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const setSelectedResume = useTailorStore(state => state.setSelectedResume)

  // MOCK DATA for ID 
  const resume = {
    name: 'Google_SWE_Final.pdf',
    date: 'Mar 5, 2026',
    type: 'PDF',
    size: '284KB',
    score: 87,
    breakdown: [
      { label: 'Technical Skills', score: 92 },
      { label: 'Tools & Tech', score: 85 },
      { label: 'Soft Skills', score: 78 },
      { label: 'Education', score: 90 },
    ],
    keywords: [
      { name: 'Python', percent: 100, status: 'matched' },
      { name: 'React', percent: 85, status: 'partial' },
      { name: 'Docker', percent: 0, status: 'missing' },
    ],
    sessions: [
      {
        id: 'sess_1',
        title: 'Senior SWE',
        company: 'Google',
        date: 'Yesterday',
        delta: '+25 pts'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    if (status === 'matched') return 'var(--green)'
    if (status === 'partial') return '#F59E0B'
    return '#EF4444'
  }

  const getStatusBadge = (status: string) => {
    if (status === 'matched') return '✓'
    if (status === 'partial') return '~'
    return '✗'
  }

  const handleTailorSession = (sessionId?: string) => {
    setSelectedResume(params.id)
    if (sessionId) {
      router.push(`/tailor/editor?session=${sessionId}`)
    } else {
      router.push('/tailor')
    }
  }

  return (
    <div className="dashboard-content max-width-wrapper">
      <button className="back-btn-blue margin-b-24" onClick={() => router.back()}>
        <ArrowLeft size={14} className="margin-r-6" /> My Resumes
      </button>

      <div className="resume-detail-header margin-b-32">
        <div className="left-side">
          <h1 className="instrument-title-28">{resume.name}</h1>
          <p className="subtext-muted">Uploaded {resume.date} · {resume.type} · {resume.size}</p>
        </div>
        <button className="btn-blue-filled" onClick={() => handleTailorSession()}>
          Tailor This Resume →
        </button>
      </div>

      <div className="two-col-grid margin-b-32">
        
        {/* Left Col: ATS Score */}
        <div className="card-white padding-28">
          <h3 className="uppercase-label margin-b-20">ATS Score</h3>
          
          <div className="center-flex flex-col margin-b-24">
            <ATSScoreRing score={resume.score} size={160} />
          </div>

          <div className="score-bars">
            {resume.breakdown.map((b, i) => (
              <div key={i} className="score-bar-row">
                <div className="flex-between margin-b-6">
                  <span className="text-13">{b.label}</span>
                  <span className="text-13 align-right">{b.score}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${b.score}%`, background: getStatusColor(b.score > 80 ? 'matched' : 'partial') }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Keywords */}
        <div className="card-white padding-28">
           <h3 className="uppercase-label margin-b-20">Keyword Coverage</h3>
           
           <div className="keyword-list">
             {resume.keywords.map((kw, i) => (
               <div key={i} className="keyword-row margin-b-14">
                 <div className="flex-between margin-b-6">
                   <span className="text-14-medium">{kw.name}</span>
                   <span className="text-13-bold">{kw.percent}% <span className="status-badge-inline" style={{ color: getStatusColor(kw.status) }}>{getStatusBadge(kw.status)}</span></span>
                 </div>
                 <div className="progress-track">
                   <div className="progress-fill" style={{ width: `${kw.percent}%`, background: getStatusColor(kw.status) }} />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Tailoring Sessions Table */}
      <div className="card-white padding-24 margin-b-32">
        <div className="flex-between margin-b-24">
          <h3 className="text-18-semi">Tailoring Sessions for This Resume</h3>
          <button className="btn-ink-pill-small" onClick={() => handleTailorSession()}>New Session +</button>
        </div>

        <table className="sessions-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th>Date</th>
                <th>Score Change</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resume.sessions.map((sess) => (
                <tr key={sess.id}>
                  <td>
                    <div className="company-flex">
                      <div className="company-icon">{sess.company[0]}</div>
                      {sess.company}
                    </div>
                  </td>
                  <td>{sess.title}</td>
                  <td>{sess.date}</td>
                  <td><span className="change-pill green">{sess.delta}</span></td>
                  <td className="align-right action-buttons">
                    <button className="btn-outline-small" onClick={() => handleTailorSession(sess.id)}>View</button>
                    <button className="btn-blue-small" onClick={() => handleTailorSession()}>Re-tailor</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Check, Star, Search, Clock, FileType, CheckCircle2 } from 'lucide-react'

// Placeholder for real DB fetching
const fetchDashboardStats = async () => ({
  resumesCount: 2,
  bestAtsScore: 87,
  keywordsAnalyzed: 142,
  sessionsRun: 5,
})

const MOCK_SESSIONS = [
  { id: '1', resume: 'Google_SWE.pdf', title: 'Senior Developer', company: 'Google', date: 'Mar 10', score: 87, change: '+25 pts', status: 'Complete' },
  { id: '2', resume: 'Stripe_Backend.docx', title: 'Backend Engineer', company: 'Stripe', date: 'Mar 8', score: 62, change: '+12 pts', status: 'Reviewing' }
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchDashboardStats().then(setStats)
  }, [supabase.auth])

  const name = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Guest'

  const StatCard = ({ title, value, unit }: { title: string, value: string | number, unit?: string }) => (
    <div className="stat-card">
      <div className="stat-value">
        {value} <span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{title}</div>
    </div>
  )

  return (
    <div className="dashboard-content">
      {/* Greeting */}
      <div className="dashboard-greeting margin-b-32">
        <h1 className="greeting-title">Hi, {name} 👋</h1>
        <p className="greeting-sub">Good morning. Ready to land your next role?</p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="stats-row margin-b-32">
          <StatCard title="Resumes Uploaded" value={stats.resumesCount} />
          <StatCard title="Best ATS Score" value={stats.bestAtsScore} unit="/100" />
          <StatCard title="Keywords Analyzed" value={stats.keywordsAnalyzed} />
          <StatCard title="Sessions Run" value={stats.sessionsRun} />
        </div>
      )}

      {/* Action Cards */}
      <div className="action-cards-grid margin-b-32">
        {/* Tailor Card */}
        <div className="action-card primary" onClick={() => router.push('/tailor')}>
          <div className="action-icon-circle action-icon-white">
            <Star style={{ color: 'white' }} size={24} />
          </div>
          <h2 className="action-title">Tailor a Resume</h2>
          <p className="action-sub">
            Upload your resume + paste a JD. Get a tailored version in under 60 seconds.
          </p>
          <button className="action-btn-white">Start Tailoring →</button>
        </div>

        {/* Job Hunt Card disabled */}
        <div className="action-card disabled">
          <span className="mode-badge">Mode 2</span>
          <div className="action-icon-circle action-icon-grey">
            <Search style={{ color: 'var(--ink)' }} size={24} />
          </div>
          <h2 className="action-title action-ink">Job Hunt</h2>
          <p className="action-sub-muted">
            AI finds jobs that match your resume. Coming in Mode 2.
          </p>
          <button className="action-btn-grey" disabled>Coming Soon</button>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="table-section">
        <div className="table-header-row">
          <h3 className="section-title">Recent Sessions</h3>
          <Link href="/history" className="view-all-link">View All →</Link>
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resume</th>
                <th>Target Job</th>
                <th>Company</th>
                <th>Date</th>
                <th>Score</th>
                <th>Change</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SESSIONS.map((sess) => (
                <tr key={sess.id} onClick={() => router.push(`/tailor/editor?session=${sess.id}`)}>
                  <td className="truncate-140"><FileType size={14} className="inline-icon" /> {sess.resume}</td>
                  <td>{sess.title}</td>
                  <td>{sess.company}</td>
                  <td>{sess.date}</td>
                  <td><span className={sess.score >= 80 ? 'text-green' : sess.score >= 60 ? 'text-orange' : 'text-red'}>{sess.score}</span></td>
                  <td><span className="change-pill green">{sess.change}</span></td>
                  <td>
                    <span className="status-flex">
                      {sess.status === 'Complete' ? <CheckCircle2 size={14} color="var(--green)" /> : <Clock size={14} />} {sess.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

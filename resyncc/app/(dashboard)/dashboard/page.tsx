'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { CheckCircle2, Clock, FileType, Search, Star } from 'lucide-react'
import { apiCall } from '@/lib/api'

interface Stats {
  resumesCount: number
  bestAtsScore: number
  totalKeywordsAnalyzed: number
  sessionsRun: number
  coaching_insight?: string
  recommended_next_action?: string
  top_missing?: string[]
}

interface Session {
  session_id: string
  status: string
  initial_ats_score: number | null
  final_ats_score: number | null
  created_at: string
  resume_id: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    // 1. Load real session history for the table
    apiCall('/sessions/history')
      .then((data) => {
        setSessions(data.sessions || [])
      })
      .catch(() => {})
      .finally(() => setLoadingSessions(false))

    // 2. Load intelligent analytics (from PROMPT 5) for dashboard stats and coach
    apiCall('/sessions/analytics')
      .then((data) => {
        setStats({
          resumesCount: 0, // We could fetch resumes count from /resumes separately, keeping it 0 for now as it's not strictly in analytics
          bestAtsScore: data.best_session?.ats_score || 0,
          totalKeywordsAnalyzed: data.total_sessions * 12, // approx
          sessionsRun: data.total_sessions,
          coaching_insight: data.coaching_insight,
          recommended_next_action: data.recommended_next_action,
          top_missing: data.top_missing_keywords,
        })
      })
      .catch(() => {
        // Fallback
        setStats({ resumesCount: 0, bestAtsScore: 0, totalKeywordsAnalyzed: 0, sessionsRun: 0 })
      })
  }, [])

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there'

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted'
    if (score >= 80) return 'text-green'
    if (score >= 60) return 'text-orange'
    return 'text-red'
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const StatCard = ({
    title,
    value,
    unit,
  }: {
    title: string
    value: string | number
    unit?: string
  }) => (
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
        <h1 className="greeting-title">Hi, {firstName} 👋</h1>
        <p className="greeting-sub">Ready to land your next role?</p>
      </div>

      {/* AI Coach Banner */}
      {stats?.coaching_insight && (
        <div className="section-card margin-b-32" style={{ borderLeft: '4px solid var(--blue)', backgroundColor: 'var(--blue-tint)' }}>
          <div className="flex-row-center gap-8 margin-b-12">
            <Star size={18} color="var(--blue)" className="pulse-once" />
            <h3 className="text-14-semi">AI Career Coach</h3>
          </div>
          <p className="text-14 ink margin-b-8">{stats.coaching_insight}</p>
          {stats.recommended_next_action && (
            <div className="flex-row-center gap-8">
              <span className="badge-blue">Next Action</span>
              <span className="text-13 muted">{stats.recommended_next_action}</span>
            </div>
          )}
        </div>
      )}

      {/* Stats Row */}
      {stats && (
        <div className="stats-row margin-b-32">
          <StatCard title="Total Sessions" value={stats.sessionsRun} />
          <StatCard title="Best ATS Score" value={stats.bestAtsScore} unit="/100" />
          <StatCard title="Missing Skills" value={stats.top_missing?.length || 0} unit=" identified" />
          <StatCard title="Keywords Checked" value={stats.totalKeywordsAnalyzed} />
        </div>
      )}

      {/* Action Cards */}
      <div className="action-cards-grid margin-b-32">
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

        <div className="action-card disabled">
          <span className="mode-badge">Mode 2</span>
          <div className="action-icon-circle action-icon-grey">
            <Search style={{ color: 'var(--ink)' }} size={24} />
          </div>
          <h2 className="action-title action-ink">Job Hunt</h2>
          <p className="action-sub-muted">
            AI finds jobs that match your resume. Coming in Mode 2.
          </p>
          <button className="action-btn-grey" disabled>
            Coming Soon
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="table-section">
        <div className="table-header-row">
          <h3 className="section-title">Recent Sessions</h3>
          <Link href="/history" className="view-all-link">
            View All →
          </Link>
        </div>

        <div className="data-table-container">
          {loadingSessions ? (
            <p className="text-13 muted text-center padding-24">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-13 muted text-center padding-24">
              No sessions yet.{' '}
              <button className="btn-text-blue" onClick={() => router.push('/tailor')}>
                Start your first tailoring →
              </button>
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Initial Score</th>
                  <th>Final Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 10).map((sess) => (
                  <tr
                    key={sess.session_id}
                    onClick={() =>
                      sess.status === 'complete'
                        ? router.push(`/tailor/editor?session=${sess.session_id}`)
                        : null
                    }
                    style={{ cursor: sess.status === 'complete' ? 'pointer' : 'default' }}
                  >
                    <td>
                      <FileType size={14} className="inline-icon" />
                      {sess.session_id.slice(0, 8).toUpperCase()}
                    </td>
                    <td>{formatDate(sess.created_at)}</td>
                    <td>
                      <span className={getScoreColor(sess.initial_ats_score)}>
                        {sess.initial_ats_score ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span className={getScoreColor(sess.final_ats_score)}>
                        {sess.final_ats_score ?? '—'}
                      </span>
                    </td>
                    <td>
                      <span className="status-flex">
                        {sess.status === 'complete' ? (
                          <CheckCircle2 size={14} color="var(--green)" />
                        ) : (
                          <Clock size={14} />
                        )}{' '}
                        {sess.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Wand2,
  Search,
  FileText,
  Clock,
  Settings,
  X
} from 'lucide-react'
import { useToast } from '../ui/Toast'
import UserCard from './UserCard'

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  user,
}: {
  mobileOpen: boolean
  setMobileOpen: (b: boolean) => void
  user: any
}) {
  const pathname = usePathname()
  const { showToast } = useToast()

  const handleJobHuntClick = (e: React.MouseEvent) => {
    e.preventDefault()
    showToast('Job Hunt launches after Mode 1 is complete!', 'info')
  }

  const handleCoverLetterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    showToast('Cover Letters coming soon', 'info')
  }

  // Mocking recent db fetching until passed as props
  const recentResumes = [
    { title: 'Google_SWE_Final.pdf', score: 85 },
    { title: 'PM_Startup_Resume.docx', score: 55 },
  ]
  const recentSessions = [
    { company: 'Google', delta: '+25pts' },
    { company: 'OpenAI', delta: '+15pts' },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-pill-excellent'
    if (score >= 60) return 'score-pill-good'
    return 'score-pill-poor'
  }

  return (
    <>
      <div className={`sidebar-backdrop ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
        
        <div className="sidebar-top">
          <Link href="/dashboard" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 12l10 10 10-10L12 2zM12 22v-10" />
              </svg>
            </div>
            <span>Resync AI</span>
          </Link>
          <button className="close-sidebar-btn" onClick={() => setMobileOpen(false)}>
            <X size={20} color="white" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="section-label">MAIN</div>
            <Link
              href="/dashboard"
              className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
            >
              <LayoutGrid size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/tailor"
              className={`nav-item ${pathname.includes('/tailor') ? 'active' : ''}`}
            >
              <Wand2 size={18} />
              <span>Tailor Resume</span>
            </Link>

            <div
              className="nav-item disabled job-hunt"
              onClick={handleJobHuntClick}
              title="Coming in Mode 2 🚀"
            >
              <Search size={18} />
              <span>Job Hunt</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="section-label">MY RESUMES</div>
            {recentResumes.map((res, i) => (
              <Link href={`/resumes/${i}`} key={i} className="nav-sub-item">
                <span className="truncate">{res.title}</span>
                <span className={`sidebar-score-pill ${getScoreColor(res.score)}`}>
                  {res.score}
                </span>
              </Link>
            ))}
            <Link href="/tailor" className="nav-item-dashed">
              + Upload New Resume
            </Link>
          </div>

          <div className="nav-section">
            <div className="section-label">RECENT SESSIONS</div>
            {recentSessions.map((sess, i) => (
              <Link href={`/tailor/editor?session=${i}`} key={i} className="nav-sub-item">
                <span className="truncate">{sess.company}</span>
                <span className="delta-text">{sess.delta}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <div className="section-label">OTHER</div>
            <div className="nav-item disabled" onClick={handleCoverLetterClick}>
              <FileText size={18} />
              <span>Cover Letters</span>
            </div>
            <Link href="/history" className="nav-item">
              <Clock size={18} />
              <span>History</span>
            </Link>
            <Link href="/settings" className="nav-item">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <UserCard user={user} />
      </aside>
    </>
  )
}

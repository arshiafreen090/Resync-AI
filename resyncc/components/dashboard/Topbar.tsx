'use client'

import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'

// Pass setSidebarOpen for mobile drawer handling
export default function Topbar({ setSidebarOpen }: { setSidebarOpen: (b: boolean) => void }) {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard'
    if (pathname.includes('/resumes')) return 'My Resumes'
    if (pathname.includes('/tailor/editor')) return 'Review & Export'
    if (pathname.includes('/tailor/keywords')) return 'Keyword Review'
    if (pathname.includes('/tailor/preview')) return 'Analysis Preview'
    if (pathname.includes('/tailor/loading')) return 'Analyzing...'
    if (pathname.includes('/tailor')) return 'Tailor Resume'
    return 'ReSync AI'
  }

  // Extract from a generic mock hook for now
  const userFirstLetter = 'A' // Mocking User

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </button>
        <span className="page-title">{getPageTitle()}</span>
      </div>
      
      <div className="topbar-right">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="user-avatar-circle">
          {userFirstLetter}
        </div>
      </div>
    </header>
  )
}

'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function UserCard({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  // Fallbacks if user isn't fully loaded
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const firstLetter = name.charAt(0).toUpperCase()
  const plan = user?.plan || 'Free'

  const handleLogOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="sidebar-bottom-section">
      <div className="sidebar-user-card">
        <div className="user-avatar">{firstLetter}</div>
        <div className="user-info">
          <div className="user-name">{name}</div>
          <div className="user-plan">{plan} Plan</div>
        </div>
      </div>

      {plan === 'Free' && (
        <button className="upgrade-btn-sidebar" onClick={() => router.push('/subscription')}>
          ⚡ Upgrade to Pro
        </button>
      )}

      <button className="logout-btn-sidebar" onClick={handleLogOut}>
        <LogOut size={14} /> Log Out
      </button>
    </div>
  )
}

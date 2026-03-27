'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'
import { ToastProvider } from '@/components/ui/Toast'

import '@/styles/dashboard.css'
import '@/styles/tailor.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Close mobile side drawer on navigation changes
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        setLoading(false)
        router.replace('/login')
        return
      }
      
      setUser(session.user)
      setLoading(false)
    }
    
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        router.replace('/login')
      } else {
        setUser(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  if (loading) {
    return (
      <div className="dashboard-shell loading">
        <div style={{ margin: 'auto' }}>Gathering instance data...</div>
      </div>
    )
  }

  // Prevent flicker after logout redirect
  if (!user) return null

  return (
    <ToastProvider>
      <div className="dashboard-shell flex-row">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} user={user} />
        
        <div className="dashboard-main-area flex-1 overflow-y-auto w-full relative">
          <Topbar setSidebarOpen={setMobileOpen} />
          <main className="dashboard-content-frame bg-dashboard min-h-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}

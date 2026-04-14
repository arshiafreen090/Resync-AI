'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function AuthCTAButton({ className, children }: Props) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
      setChecked(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleClick = () => {
    if (!checked) return
    router.push(loggedIn ? '/dashboard' : '/login')
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}

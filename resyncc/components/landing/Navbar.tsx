'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const hero = document.getElementById('hero')
    if (!hero) return

    function updateNavColor() {
      if (!nav || !hero) return
      const navBottom = nav.getBoundingClientRect().bottom
      const heroBottom = hero.getBoundingClientRect().bottom

      if (navBottom >= heroBottom - 40) {
        setIsDark(true)
      } else {
        setIsDark(false)
      }
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNavColor()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateNavColor()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav ref={navRef} className={isDark ? 'nav-dark' : ''}>
      <a href="#" className="nav-logo">
        <Image src="/assets/logo-dark.svg" className="nav-logo-img logo-white" alt="Resync AI" width={100} height={48} style={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}} />
        <Image src="/assets/logo-light.svg" className="nav-logo-img logo-dark" alt="Resync AI" width={100} height={48} style={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}} />
      </a>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>
      <div className="nav-actions">
        <Link href="/login" className="btn-ghost">Sign In</Link>
        <Link href="/signup" className="btn-primary">
          Try Free
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

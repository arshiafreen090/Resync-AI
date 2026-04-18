'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  // Close mobile menu on outside click / escape
  useEffect(() => {
    if (!mobileOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mobileOpen])

  const handleMobileNavClick = () => setMobileOpen(false)

  return (
    <>
      <nav ref={navRef} className={isDark ? 'nav-dark' : ''}>
        <a href="#" className="nav-logo" aria-label="Resync AI home">
          <Image src="/assets/logo-dark.svg" className="nav-logo-img logo-white" alt="Resync AI" width={100} height={48} style={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}} />
          <Image src="/assets/logo-light.svg" className="nav-logo-img logo-dark" alt="Resync AI" width={100} height={48} style={{position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)'}} />
        </a>
        <ul className="nav-links" role="list">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">Sign In</Link>
          <Link href="/signup" className="btn-primary">
            Try Free
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round" />
            </svg>
          </Link>
          {/* Hamburger — visible on mobile only */}
          <button
            className="nav-hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(o => !o)}
          >
            <span className={`hamburger-bar${mobileOpen ? ' open' : ''}`}></span>
            <span className={`hamburger-bar${mobileOpen ? ' open' : ''}`}></span>
            <span className={`hamburger-bar${mobileOpen ? ' open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          id="mobile-nav"
          onClick={handleMobileNavClick}
        >
          <nav className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <ul className="mobile-nav-links" role="list">
              <li><a href="#features" onClick={handleMobileNavClick}>Features</a></li>
              <li><a href="#how-it-works" onClick={handleMobileNavClick}>How It Works</a></li>
              <li><a href="#testimonials" onClick={handleMobileNavClick}>Testimonials</a></li>
              <li><a href="#pricing" onClick={handleMobileNavClick}>Pricing</a></li>
            </ul>
            <div className="mobile-nav-actions">
              <Link href="/login" className="mobile-btn-ghost" onClick={handleMobileNavClick}>Sign In</Link>
              <Link href="/signup" className="mobile-btn-primary" onClick={handleMobileNavClick}>
                Try Free →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

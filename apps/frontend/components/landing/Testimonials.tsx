'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function Testimonials() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const initUniqueTestimonials = useCallback(() => {
    if (!wrapperRef.current) return
    const pills = wrapperRef.current.querySelectorAll('.unique-avatar-pill')
    const quotes = wrapperRef.current.querySelectorAll('.unique-quote')
    const roles = wrapperRef.current.querySelectorAll('.unique-role')
    let isAnimating = false

    if (!pills.length || !quotes.length || !roles.length) return

    pills.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (isAnimating || btn.classList.contains('active')) return
        const index = btn.getAttribute('data-index')

        isAnimating = true

        quotes.forEach(q => {
          if (q.classList.contains('active')) {
            q.classList.remove('active')
            q.classList.add('exiting')
          }
        })
        roles.forEach(r => {
          if (r.classList.contains('active')) {
            r.classList.remove('active')
            r.classList.add('exiting')
          }
        })

        setTimeout(() => {
          quotes.forEach(q => q.classList.remove('exiting'))
          roles.forEach(r => r.classList.remove('exiting'))
          pills.forEach(p => p.classList.remove('active'))

          btn.classList.add('active')

          const targetQuote = wrapperRef.current?.querySelector(`.unique-quote[data-index="${index}"]`)
          if (targetQuote) targetQuote.classList.add('active')

          const targetRole = wrapperRef.current?.querySelector(`.unique-role[data-index="${index}"]`)
          if (targetRole) targetRole.classList.add('active')

          setTimeout(() => {
            isAnimating = false
          }, 400)

        }, 200)
      })
    })
  }, [])

  useEffect(() => {
    initUniqueTestimonials()
  }, [initUniqueTestimonials])

  return (
    <div className="max-w testi-layout" ref={wrapperRef}>
      <div className="testi-left">
        <div className="testi-header-content">
          <div className="section-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Testimonials
          </div>
          <h2 className="section-headline" style={{marginTop:'24px'}}>People are getting hired.<br/>Here&apos;s what they&apos;re
            saying.</h2>
          <p className="section-sub" style={{marginTop:'24px', fontSize:'18px', lineHeight:1.6, color:'rgba(14,12,10,0.6)'}}>
            ReSync AI users report <strong>3× more interview callbacks</strong> after dynamically tailoring their
            resumes. Our cutting-edge keyword extraction and contextual matching completely eliminates the guesswork
            from your job applications. See exactly how our system changes the hiring narrative for professionals
            worldwide.
          </p>
        </div>
      </div>

      <div className="testi-right">
        <div className="unique-testi-wrapper"
          style={{position: 'relative', borderRadius: '24px', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden'}}>
          <div className="unique-card-content"
            style={{position: 'relative', zIndex: 2, borderRadius: '24px', padding: '40px 24px'}}>

            <div className="unique-quotes-container text-center relative px-12 py-4">
              <div className="unique-quotes">
                <p className="unique-quote active" data-index="0">ReSync AI changed everything for my job search. I
                  went from 0 to 5 interviews in a week.</p>
                <p className="unique-quote" data-index="1">The keyword extraction is pinpoint accurate. It matched
                  my experience perfectly to the JD.</p>
                <p className="unique-quote" data-index="2">Simply brilliant. The glassmorphism UI makes the whole
                  experience feel exceptionally premium.</p>
                <p className="unique-quote" data-index="3">I finally feel confident hitting &apos;Apply&apos;. ReSync does the
                  heavy lifting for me effortlessly.</p>
                <p className="unique-quote" data-index="4">The best tool for modern job seekers. It&apos;s like having a
                  career coach in your pocket right now.</p>
              </div>
            </div>

            <div className="unique-roles-avatars"
              style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginTop: '48px'}}>

              <div className="unique-roles">
                <p className="unique-role active" data-index="0">SOFTWARE ENGINEER</p>
                <p className="unique-role" data-index="1">PRODUCT MANAGER</p>
                <p className="unique-role" data-index="2">UX DESIGNER</p>
                <p className="unique-role" data-index="3">DATA SCIENTIST</p>
                <p className="unique-role" data-index="4">MARKETING LEAD</p>
              </div>

              <div className="unique-avatars-bar">
                <button className="unique-avatar-pill active" data-index="0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
                    alt="Sarah Chen" className="unique-avatar-img" />
                  <div className="unique-avatar-name-drawer">
                    <span className="unique-name-text">Sarah Chen</span>
                  </div>
                </button>

                <button className="unique-avatar-pill" data-index="1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                    alt="Marcus Johnson" className="unique-avatar-img" />
                  <div className="unique-avatar-name-drawer">
                    <span className="unique-name-text">Marcus Johnson</span>
                  </div>
                </button>

                <button className="unique-avatar-pill" data-index="2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                    alt="Elena Rodriguez" className="unique-avatar-img" />
                  <div className="unique-avatar-name-drawer">
                    <span className="unique-name-text">Elena Rodriguez</span>
                  </div>
                </button>

                <button className="unique-avatar-pill" data-index="3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                    alt="David Kim" className="unique-avatar-img" />
                  <div className="unique-avatar-name-drawer">
                    <span className="unique-name-text">David Kim</span>
                  </div>
                </button>

                <button className="unique-avatar-pill" data-index="4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                    alt="Aisha Patel" className="unique-avatar-img" />
                  <div className="unique-avatar-name-drawer">
                    <span className="unique-name-text">Aisha Patel</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

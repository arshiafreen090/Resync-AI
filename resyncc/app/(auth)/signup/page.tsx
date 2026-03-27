'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router, supabase.auth])

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      })
    } catch (err) {
      console.error('Error signing up:', err)
      setGoogleLoading(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords don't match", isError: true })
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    })

    setLoading(false)

    if (error) {
      setMessage({ text: error.message, isError: true })
    } else {
      setMessage({ text: 'Check your email to confirm your account!', isError: false })
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="auth-page">
      <video className="auth-video-bg" autoPlay muted loop playsInline>
        <source src="/assets/auth-bg.mp4" type="video/mp4" />
      </video>
      <div className="auth-overlay"></div>
      <div className="auth-footer-text">© 2026 Resync AI</div>

      <div className="auth-card">
        <div className="auth-noise-overlay"></div>

        <div className="auth-logo-wrap">
          <Link href="/" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.svg" alt="Resync AI"
              style={{height: '32px', width: 'auto', objectFit: 'contain'}} />
          </Link>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start tailoring your resume to every job.</p>

        <div className="auth-divider"></div>

        <button
          id="google-signup-btn"
          className={`btn-google ${googleLoading ? 'loading' : ''}`}
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4" />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853" />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84z"
              fill="#FBBC05" />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335" />
          </svg>
          <div className="spinner"></div>
          Continue with Google
        </button>

        <div className="auth-method-divider">
          <span>or continue with email</span>
        </div>

        <form id="email-signup-form" className="auth-form" onSubmit={handleEmailSignup}>
          <div className="auth-input-group">
            <input type="email" id="email" className="auth-input" placeholder="your@email.com" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-input-group">
            <input type={showPassword ? 'text' : 'password'} id="password" className="auth-input" placeholder="Password" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="auth-pwd-toggle" tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div className="auth-input-group">
            <input type="password" id="confirm-password" className="auth-input" placeholder="Confirm Password"
              required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button type="submit" className={`btn-auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
            <div className="spinner"></div>
            <span className="btn-text">Create Account</span>
          </button>
          {message && (
            <div className={`auth-msg ${message.isError ? 'error' : 'success'}`} style={{display: 'block'}}>
              {message.text}
            </div>
          )}
        </form>

        <Link href="/login" className="auth-switch">Already have an account? Sign in →</Link>

        <p className="auth-legal">By continuing, you agree to our Terms and Privacy Policy</p>
      </div>
    </div>
  )
}

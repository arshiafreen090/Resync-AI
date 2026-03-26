import Link from 'next/link'

export default function Hero() {
  return (
    <section id="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-inverted-overlay.png" className="hero-inverted-overlay" alt="Hero Inverted Overlay" />
      <div className="hero-badge">
        <div className="badge-dot"></div>
        AI-Powered Resume Tailoring — Now Live
      </div>

      <h1 className="hero-headline">
        Your resume, <em>perfectly synced</em><br />
        <span className="line-2">to every job.</span>
      </h1>

      <p className="hero-sub">
        Paste a job description. Resync AI reads every keyword, matches it to your experience, and rewrites your bullets —
        all in seconds.
      </p>

      <div className="hero-cta">
        <Link href="/signup" className="btn-hero">
          <span className="btn-text">Get tailored resume</span>
          <span className="btn-arrow-icon">→</span>
        </Link>
        <span className="hero-note">No credit card required · Free forever plan</span>
      </div>

      {/* Dashboard UI Preview */}
      <div className="hero-preview">
        <iframe src="/dashboard-preview/index.html" className="dash-layout"
          style={{border: 'none', width: '100%', height: '100%', minHeight: '640px', borderRadius: '22px'}}></iframe>
        <div
          style={{position: 'absolute', inset: 0, pointerEvents: 'none', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)', borderRadius: '22px', zIndex: 10}}>
        </div>
        {/* Cloud Fade Overlay */}
        <div className="dash-bottom-fade"></div>
      </div>
    </section>
  )
}

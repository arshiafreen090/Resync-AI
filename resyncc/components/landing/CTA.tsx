export default function CTA() {
  return (
    <>
      <div className="cta-glow"></div>
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-headline">Stop sending resumes that don&apos;t get read.</h2>
          <p className="cta-sub">Join 50,000+ job seekers who tailored their way to interviews.</p>
          <div className="cta-actions">
            <a href="#" className="btn-cta-primary">
              <span className="btn-text">Get tailored resume</span>
              <span className="btn-arrow-icon">→</span>
            </a>
            <a href="#" className="btn-cta-ghost">
              <span className="btn-text">See a Demo</span>
              <span className="btn-arrow-icon">→</span>
            </a>
          </div>
          <span className="hero-note" style={{display:'block', marginTop:'20px', opacity:0.6, color:'white', fontSize:'13px'}}>No
            credit card required · Free forever plan</span>
        </div>
      </div>
      <div className="cta-visual">
        <iframe src="/dashboard-preview/index.html" className="cta-dash-frame" title="Dashboard Preview"></iframe>
      </div>
    </>
  )
}

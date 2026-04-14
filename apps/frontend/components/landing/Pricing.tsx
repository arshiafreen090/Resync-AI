export default function Pricing() {
  return (
    <div className="max-w">
      <div className="pricing-header">
        <div className="section-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" style={{display:'inline-block', verticalAlign:'-2px', marginRight:'4px'}}>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg> Pricing</div>
        <h2 className="section-headline">Simple pricing. Zero resume tax.</h2>
        <p className="section-sub">Pay once per month. Tailor as many resumes as your job hunt demands.</p>
      </div>
      <div className="pricing-grid">
        <div className="pricing-card reveal">
          <div className="plan-name">Starter</div>
          <div className="plan-price"><sub>Rs</sub>0</div>
          <div className="plan-period">/ month — forever free</div>
          <div className="plan-divider"></div>
          <ul className="plan-features">
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> 3 resume tailorings per month</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> Keyword extraction &amp; scoring</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> AI bullet modification</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> PDF export</li>
          </ul>
          <a href="#" className="btn-plan btn-plan-outline">
            <span className="btn-text">Get Started Free</span>
            <span className="btn-arrow-icon">→</span>
          </a>
        </div>
        <div className="pricing-card popular reveal reveal-delay-1">
          <div className="popular-badge">Most Popular</div>
          <div className="plan-name">Pro</div>
          <div className="plan-price"><sub>Rs</sub>10</div>
          <div className="plan-period">/ month, billed monthly</div>
          <div className="plan-divider"></div>
          <ul className="plan-features">
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> Unlimited resume tailorings</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> Advanced contextual matching</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> AI cover letter generator</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> PDF + DOCX export</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> Session history &amp; comparison</li>
            <li><span className="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" style={{verticalAlign:'middle'}}>
                  <polyline points="20 6 9 17 4 12" />
                </svg></span> Priority AI processing</li>
          </ul>
          <a href="#" className="btn-plan btn-plan-white">
            <span className="btn-text">Start Pro — Rs 10/mo</span>
            <span className="btn-arrow-icon">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

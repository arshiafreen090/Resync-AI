export default function HowItWorks() {
  return (
    <div className="max-w">
      <div style={{maxWidth:'520px'}}>
        <div className="section-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" style={{display:'inline-block', verticalAlign:'-2px', marginRight:'4px'}}>
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z">
            </path>
          </svg> How It Works</div>
        <h2 className="section-headline">From job post to<br/>tailored resume in 4 steps.</h2>
        <p className="section-sub">No forms to fill, no templates to wrestle. Just paste, review, and download.</p>
      </div>

      <div className="steps-layout">
        <div className="steps-list reveal">
          <div className="step-item">
            <div className="step-num">01</div>
            <div className="step-content">
              <div className="step-title">Paste the Job Description</div>
              <div className="step-desc">Drop in any job posting URL or raw text. Resync extracts every keyword —
                required
                skills, soft skills, tools, and contextual phrases — ranked by how critical each is to the role.
              </div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">02</div>
            <div className="step-content">
              <div className="step-title">Upload Your Current Resume</div>
              <div className="step-desc">Resync reads your resume and cross-matches it against the extracted keywords.
                It
                identifies gaps, contextual matches, and bullets that already qualify — without you lifting a
                finger.
              </div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">03</div>
            <div className="step-content">
              <div className="step-title">Review &amp; Accept AI Suggestions</div>
              <div className="step-desc">For each keyword, Resync shows you exactly what it changed and why. Accept
                revisions, request a fix, or edit manually. Every decision is yours — AI does the heavy lifting.
              </div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-num">04</div>
            <div className="step-content">
              <div className="step-title">Download &amp; Apply with Confidence</div>
              <div className="step-desc">Export your tailored resume as a polished PDF or DOCX. Your resume is now
                ATS-ready, keyword-rich, and optimized specifically for that job — not a generic template.</div>
            </div>
          </div>
        </div>

        <div className="steps-visual reveal reveal-delay-2">
          <div
            style={{fontSize:'12px',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'rgba(14,12,10,.35)',marginBottom:'16px'}}>
            Keyword Integration Status</div>
          <div className="kw-card matched">
            <div className="kw-name"><span style={{color:'var(--green)'}}>●</span> Machine Learning</div>
            <div className="kw-status g"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3"
                style={{display:'inline-block', verticalAlign:'middle', marginRight:'2px'}}>
                <polyline points="20 6 9 17 4 12" />
              </svg> Matched</div>
          </div>
          <div className="kw-card pending">
            <div className="kw-name"><span style={{color:'var(--orange)'}}>●</span> Product Management</div>
            <div className="kw-status o"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                style={{display:'inline-block', verticalAlign:'middle', marginRight:'2px'}}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg> Pending Confirmation</div>
          </div>
          <div className="kw-card modified">
            <div className="kw-name"><span style={{color:'var(--blue)'}}>●</span> Data Analysis, SQL</div>
            <div className="kw-status b"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                style={{display:'inline-block', verticalAlign:'middle', marginRight:'2px'}}>
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg> Modified Bullet</div>
          </div>
          <div className="kw-card matched">
            <div className="kw-name"><span style={{color:'var(--green)'}}>●</span> Python, TensorFlow</div>
            <div className="kw-status g"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3"
                style={{display:'inline-block', verticalAlign:'middle', marginRight:'2px'}}>
                <polyline points="20 6 9 17 4 12" />
              </svg> Matched</div>
          </div>
          <div className="kw-card" style={{background:'rgba(239,68,68,0.05)',border:'1px solid rgba(239,68,68,0.15)'}}>
            <div className="kw-name"><span style={{color:'#EF4444'}}>●</span> Kubernetes, Docker</div>
            <div className="kw-status" style={{color:'#EF4444',fontSize:'12px',fontWeight:600}}><svg width="12" height="12"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{display:'inline-block', verticalAlign:'middle', marginRight:'2px'}}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg> Not Applicable</div>
          </div>
          <div style={{marginTop:'20px',paddingTop:'20px',borderTop:'1px solid rgba(14,12,10,0.08)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
              <span style={{fontSize:'13px',color:'rgba(14,12,10,.45)'}}>Keywords Integrated</span>
              <span style={{fontSize:'13px',fontWeight:700}}>8 / 13</span>
            </div>
            <div style={{height:'8px',background:'rgba(14,12,10,.06)',borderRadius:'100px',overflow:'hidden'}}>
              <div
                style={{height:'100%',width:'62%',background:'linear-gradient(90deg,var(--blue),#6366F1)',borderRadius:'100px'}}>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

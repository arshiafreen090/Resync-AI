export default function Details() {
  return (
    <div className="max-w">
      <div style={{maxWidth:'560px',marginBottom:0}}>
        <div className="section-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2">
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg> Intelligence</div>
        <h2 className="section-headline">AI that knows the<br/>difference between close<br/><em
            style={{fontStyle:'italic',color:'var(--blue)'}}>and exact.</em></h2>
      </div>

      <div className="bento-grid reveal">
        {/* Box 1 */}
        <div className="bento-item glow-container bento-span-4">
          <div className="bento-content">
            <div className="bento-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="bento-title">Contextual Matching</h3>
              <p className="bento-desc">Identifies implied experience intelligently instead of relying on exact
                keywords alone.</p>
            </div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="bento-item glow-container bento-span-4">
          <div className="bento-content">
            <div className="bento-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h3 className="bento-title">Blazing Speed</h3>
              <p className="bento-desc">Upload your resume once and tailor it instantly. Every session is stored right
                in your dashboard.</p>
            </div>
          </div>
        </div>

        {/* Box 3 */}
        <div className="bento-item glow-container bento-span-4">
          <div className="bento-content">
            <div className="bento-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <h3 className="bento-title">Smart Additions</h3>
              <p className="bento-desc">Suggests brand new, true-to-experience keyword additions directly missing from
                your resume.</p>
            </div>
          </div>
        </div>

        {/* Box 4 */}
        <div className="bento-item glow-container bento-span-12" style={{minHeight:'240px'}}>
          <div className="bento-content row-content">
            <div style={{flex: 1}}>
              <div className="bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
              <h3 className="bento-title">AI Bullet Rewriting</h3>
              <p className="bento-desc">See your original bullet and an AI-rewritten version side by side. Accept,
                edit, or reject each change with a single click — you&apos;re always in control.</p>
            </div>
            <div className="bento-visual">
              <div className="comparison-mock"
                style={{width: '100%', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px'}}>
                <div
                  style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px'}}>
                  <div
                    style={{fontSize: '11px', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600}}>
                    Original</div>
                  <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5}}>Managed a
                    software team to build the new app interface.</div>
                </div>
                <div
                  style={{background: 'rgba(26, 86, 255, 0.08)', border: '1px solid rgba(26, 86, 255, 0.2)', borderRadius: '12px', padding: '16px', position: 'relative'}}>
                  <div style={{position: 'absolute', right: '12px', top: '12px', display: 'flex', gap: '6px'}}>
                    <div
                      style={{width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(25, 166, 103, 0.2)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg></div>
                    <div
                      style={{width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg></div>
                  </div>
                  <div
                    style={{fontSize: '11px', textTransform: 'uppercase' as const, color: 'var(--blue)', marginBottom: '8px', fontWeight: 600}}>
                    AI Rewritten</div>
                  <div
                    style={{fontSize: '13px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, paddingRight: '48px'}}>
                    Spearheaded a cross-functional <span className="keyword-highlight">engineering team</span>
                    to architect and deploy a scalable <span className="keyword-highlight">React</span>
                    application...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

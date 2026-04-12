export default function Stats() {
  return (
    <div className="max-w">
      <div className="stats-container glow-container reveal" style={{position: 'relative', borderRadius: '20px'}}>
        <div className="stats-grid" style={{position: 'relative', zIndex: 2, background: 'var(--ink)'}}>
          <div className="stat-item">
            <div className="stat-num">3<span>×</span></div>
            <div className="stat-label">More interviews vs untailored resumes</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">60<span>s</span></div>
            <div className="stat-label">Average time to fully tailor a resume</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">94<span>%</span></div>
            <div className="stat-label">ATS pass rate on tailored resumes</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">50<span>k+</span></div>
            <div className="stat-label">Job seekers synced their way to interviews</div>
          </div>
        </div>
      </div>
    </div>
  )
}

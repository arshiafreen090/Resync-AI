'use client'

import { useEffect, useState } from 'react'

export default function ATSScoreRing({
  score,
  size = 120,
  animated = true,
  showLabel = true,
  delta,
}: {
  score: number
  size?: number
  animated?: boolean
  showLabel?: boolean
  delta?: number
}) {
  const [currentScore, setCurrentScore] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) return
    setCurrentScore(0) // reset before starting

    let start = 0
    const duration = 1500
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      
      const nextScore = Math.floor(score * easeOut)
      setCurrentScore(nextScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrentScore(score)
      }
    }
    requestAnimationFrame(animate)
  }, [score, animated])

  const r = (size / 2) - 8
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (currentScore / 100 * circumference)

  const getScoreColor = () => {
    if (currentScore >= 86) return 'var(--blue)'
    if (currentScore >= 66) return 'var(--green)'
    if (currentScore >= 41) return '#F59E0B'
    return '#EF4444'
  }

  const getTierLabel = () => {
    if (score >= 86) return <span style={{ color: 'var(--blue)' }}>Excellent</span>
    if (score >= 66) return <span style={{ color: 'var(--green)' }}>Good Match</span>
    if (score >= 41) return <span style={{ color: '#D97706' }}>Moderate</span>
    return <span style={{ color: '#DC2626' }}>Poor Match</span>
  }

  return (
    <div className="ats-ring-container" style={{ width: size, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg fill="none" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="rgba(14,12,10,0.06)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={getScoreColor()}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ 
              transition: animated ? 'stroke-dashoffset 0.1s linear' : 'none',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%' 
            }}
          />
        </svg>
        
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: size / 3,
          fontStyle: 'italic',
          color: getScoreColor()
        }}>
          {currentScore}
        </div>
      </div>

      {showLabel && (
        <div style={{ marginTop: '12px', fontWeight: 600, fontSize: '14px' }}>
          {getTierLabel()}
        </div>
      )}

      {delta !== undefined && delta !== 0 && (
        <div style={{
          marginTop: '8px',
          background: delta > 0 ? 'rgba(25,166,103,0.1)' : 'rgba(239,68,68,0.1)',
          color: delta > 0 ? 'var(--green)' : '#EF4444',
          borderRadius: '100px',
          padding: '4px 12px',
          fontSize: '13px',
          fontWeight: 700
        }}>
          {delta > 0 ? `+${delta}` : delta} pts
        </div>
      )}
    </div>
  )
}

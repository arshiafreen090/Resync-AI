'use client'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'var(--font-dm-sans), sans-serif',
      background: '#FAFAFA', // similar to cream
      gap: '16px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontFamily: 'var(--font-instrument-serif), serif', fontSize: '36px', margin: 0 }}>
        Something went wrong
      </h2>
      <p style={{ color: 'rgba(14,12,10,0.6)', fontSize: '16px', maxWidth: '400px', margin: 0 }}>
        {error.message || 'An unexpected error occurred while communicating with the server.'}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          background: '#0E0C0A', // ink color
          color: 'white',
          borderRadius: '100px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Try Again
      </button>
    </div>
  )
}

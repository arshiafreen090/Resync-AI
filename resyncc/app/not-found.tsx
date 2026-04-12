import Link from 'next/link'

export default function NotFound() {
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
      <h2 style={{ fontFamily: 'var(--font-instrument-serif), serif', fontSize: '48px', margin: 0 }}>
        404
      </h2>
      <p style={{ color: '#0E0C0A', fontSize: '20px', fontWeight: '500', margin: '8px 0' }}>
        Page not found
      </p>
      <p style={{ color: 'rgba(14,12,10,0.6)', fontSize: '16px', maxWidth: '400px', margin: 0 }}>
        We couldn&apos;t find what you were looking for. The page may have been moved or deleted.
      </p>
      <Link href="/"
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: '#0E0C0A', // ink color
          color: 'white',
          borderRadius: '100px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'transform 0.2s',
          display: 'inline-block'
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}

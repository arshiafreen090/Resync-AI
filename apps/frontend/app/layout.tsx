import type { Metadata } from 'next'
import '@/styles/globals.css'
import QueryProvider from '@/components/providers/query-provider'

export const metadata: Metadata = {
  title: 'Resync AI — Tailor Your Resume. Land the Job.',
  description: 'Paste a job description. Resync AI reads every keyword, matches it to your experience, and rewrites your bullets — all in seconds.',
  icons: {
    icon: '/assets/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// All routes under these paths require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/tailor',
  '/resumes',
  '/history',
  '/subscription',
  '/settings',
]

// Placeholder values used when env vars are absent (e.g. local dev without .env.local)
const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_KEY = 'placeholder-anon-key'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ALWAYS create a response and refresh the session.
  // This is critical for Supabase SSR — it writes the refreshed
  // auth cookies to every outgoing response.
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any)
          )
        },
      },
    },
  )

  // Calling getSession() causes the middleware to refresh the auth token
  // and write updated cookies. Must be called before any redirect.
  let session = null
  try {
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch {
    // If Supabase is not configured, treat as unauthenticated
    session = null
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // If authenticated user visits the landing page, send them to dashboard
  if (pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If unauthenticated user tries to access a protected route, redirect to login
  if (!session && isProtected) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|images/|dashboard-preview/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any)
          )
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tailor/:path*',
    '/resumes/:path*',
    '/history/:path*',
    '/subscription/:path*',
    '/settings/:path*',
  ],
}

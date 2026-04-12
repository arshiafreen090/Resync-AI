import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle error from OAuth provider
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  if (error) {
    console.error('OAuth Error:', error, errorDescription)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', error)
    return NextResponse.redirect(loginUrl)
  }

  if (code) {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log('--- Auth Callback Cookies Received ---')
    allCookies.forEach(c => console.log(`${c.name}: ${c.value.substring(0, 10)}...`))
    console.log('--------------------------------------')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set({ name, value, ...options } as any)
              } catch {
                // The `set` method may throw in Server Components.
                // This can be safely ignored.
              }
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      const redirectUrl = new URL(next.startsWith('/') ? next : `/${next}`, origin)
      console.log('✅ Auth successful! Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }

    console.error('❌ Code exchange error:', exchangeError)
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', 'OAuthSessionError')
    loginUrl.searchParams.set('error_description', exchangeError.message)
    return NextResponse.redirect(loginUrl)
  }

  // Something went wrong — missing code or params
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('error', 'MissingCodeError')
  return NextResponse.redirect(loginUrl)
}

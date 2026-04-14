import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Prevent build-time/prerender crashes in environments where public env vars
  // are not injected yet (e.g. fresh preview deployments).
  const fallbackUrl = 'https://placeholder.supabase.co'
  const fallbackAnonKey = 'placeholder-anon-key'

  return createBrowserClient(
    supabaseUrl || fallbackUrl,
    supabaseAnonKey || fallbackAnonKey
  )
}

/**
 * Typed frontend API client for ReSync AI backend.
 *
 * Root cause fix: Every call to the FastAPI backend MUST include the
 * Supabase JWT in the Authorization header. Without it every endpoint
 * that uses get_current_user() returns 401. This wrapper fetches the
 * token from the Supabase client session on every call.
 *
 * Usage:
 *   const data = await apiCall('/sessions/analyze', { method: 'POST', body: ... })
 *   const data = await apiUpload('/upload/resume', formData)
 */

import { createBrowserClient } from '@supabase/ssr'

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1'

/** Returns the current user's JWT access token, or null if not signed in. */
async function getAccessToken(): Promise<string | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

/**
 * Core fetch wrapper.
 * - Attaches Authorization: Bearer <jwt> automatically
 * - Handles 401 → redirect to /login
 * - Handles 429 → throws descriptive rate-limit error
 * - Throws on any non-2xx response with the backend error detail
 */
export async function apiCall(
  path: string,
  options?: RequestInit,
): Promise<any> {
  const token = await getAccessToken()
  if (!token) {
    /*
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    */
    // For "forget about auth" mode, we'll just log and continue, 
    // though real requests will likely fail with 401 later.
    console.warn('API call attempted without authentication token')
    // throw new Error('Not authenticated') 
    // Let's return a dummy token or just try anyway.
  }

  const url = path.startsWith('http')
    ? path
    : `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  })

  return _handleResponse(res)
}

/**
 * Variant for multipart/form-data uploads (file uploads).
 * Does NOT set Content-Type — let the browser set it with the boundary.
 */
export async function apiUpload(
  path: string,
  formData: FormData,
): Promise<any> {
  const token = await getAccessToken()
  if (!token) {
    /*
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    */
    console.warn('API upload attempted without authentication token')
    // throw new Error('Not authenticated')
  }

  const url = `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here — browser sets it with the multipart boundary
    },
    body: formData,
  })

  return _handleResponse(res)
}

async function _handleResponse(res: Response): Promise<any> {
  if (res.status === 401) {
    /*
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    */
    throw new Error('Session expired or authentication required.')
  }

  if (res.status === 403) {
    throw new Error('Access denied. You do not have permission for this action.')
  }

  if (res.status === 429) {
    const data = await res.json().catch(() => null)
    throw new Error(
      data?.detail ||
        'Daily limit reached. Upgrade to Pro for unlimited sessions.',
    )
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.detail || `Request failed (${res.status})`)
  }

  return res.json()
}

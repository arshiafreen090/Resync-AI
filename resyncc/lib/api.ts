/**
 * Frontend wrapper for backend requests.
 * Inherits standard fetch behavior but integrates centralized error handling
 * for auth failures, rate limits, and business logic exceptions.
 */

export async function apiCall(url: string, options?: RequestInit) {
  try {
    const defaultHeaders: HeadersInit = {}

    // Ensure URL has absolute path if not given
    const fetchUrl = url.startsWith('http')
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1'}${url.startsWith('/') ? url : '/' + url}`

    const res = await fetch(fetchUrl, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options?.headers || {}),
      },
    })

    if (res.status === 429) {
      throw new Error(
        'Daily limit reached. Upgrade to Pro for unlimited sessions.'
      )
    }

    if (res.status === 403) {
      throw new Error('Access denied. Please check your permissions.')
    }

    if (res.status === 401) {
      // Auto-redirect on auth failure
      // Checking window ensures this doesn't break SSR
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Unauthenticated')
    }

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.detail || 'Something went wrong')
    }

    return await res.json()
  } catch (err) {
    throw err
  }
}

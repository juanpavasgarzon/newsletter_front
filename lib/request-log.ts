/**
 * Request logging: frontend → backend API.
 * Logs method, URL, status and duration. Enabled in development or when
 * NEXT_PUBLIC_APP_LOG_REQUESTS is set.
 */

function shouldLog(): boolean {
  if (typeof process === 'undefined') {
    return false
  }
  const explicit = process.env.NEXT_PUBLIC_APP_LOG_REQUESTS
  if (explicit === 'true' || explicit === '1') {
    return true
  }
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  return false
}

export function logOutgoingRequest(params: {
  method: string
  url: string
  authenticated?: boolean
}): void {
  if (!shouldLog()) {
    return
  }
  const { method, url, authenticated } = params
  const authTag = authenticated ? ' [auth]' : ''
  console.log(`[API →] ${method} ${url}${authTag}`)
}

export function logOutgoingResponse(params: {
  method: string
  url: string
  status: number
  durationMs: number
}): void {
  if (!shouldLog()) {
    return
  }
  const { method, url, status, durationMs } = params
  const statusTag = status >= 400 ? ' ⚠' : ''
  console.log(
    `[API ←] ${method} ${url} ${status} ${durationMs}ms${statusTag}`
  )
}

import type { RequestOptions } from '@/contracts/api'
import { ApiError } from '@/api/api-error'
import { ensureApiUrl } from '@/lib/api-url'
import { getToken } from '@/lib/auth-token'
import {
  logOutgoingRequest,
  logOutgoingResponse,
} from '@/lib/request-log'

export { ApiError }

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { authenticated = false, ...init } = options
  const base = ensureApiUrl()
  const url = path.startsWith('http') ? path : `${base}${path}`
  const method = (init.method ?? 'GET').toUpperCase()
  logOutgoingRequest({ method, url, authenticated })
  const start = Date.now()
  const token = getToken()
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })
  logOutgoingResponse({
    method,
    url,
    status: res.status,
    durationMs: Date.now() - start,
  })
  const text = await res.text()
  let body: unknown
  try {
    body = text ? (JSON.parse(text) as unknown) : undefined
  } catch {
    body = text
  }
  if (!res.ok) {
    const errBody = body as { message?: string }
    const message =
      errBody.message != null
        ? errBody.message
        : res.statusText || `HTTP ${res.status}`
    throw new ApiError(message, res.status, body)
  }
  return body as T
}

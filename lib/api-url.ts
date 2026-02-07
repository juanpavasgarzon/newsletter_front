import { appEnv } from '@/config/env'

export function ensureApiUrl(): string {
  const url = appEnv.apiBaseUrl
  if (!url || !url.trim()) {
    throw new Error(
      'NEXT_PUBLIC_APP_API_URL is not set. Add it to .env or .env.local and restart the dev server (e.g. NEXT_PUBLIC_APP_API_URL=http://localhost:8000/api).',
    )
  }
  return url.replace(/\/$/, '')
}

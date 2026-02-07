import { appEnv } from '@/config/env'

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return sessionStorage.getItem(appEnv.adminSessionKey)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  sessionStorage.setItem(appEnv.adminSessionKey, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  sessionStorage.removeItem(appEnv.adminSessionKey)
}

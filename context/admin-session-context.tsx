'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'
import type { ReactNode } from 'react'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'
import {
  hydrateAdminSessionStore,
  setAdminSessionStore,
  useAdminSessionStore,
} from '@/lib/admin-session-store'

export interface AdminSessionValue {
  isAdmin: boolean
  checked: boolean
  login: (secret: string) => Promise<void>
  logout: () => void
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null)

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const { isAdmin, checked } = useAdminSessionStore()

  useLayoutEffect(() => {
    hydrateAdminSessionStore()
  }, [])

  const login = useCallback(async (secret: string) => {
    await apiLogin({ secret })
    setAdminSessionStore(true)
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setAdminSessionStore(false)
  }, [])

  const value = useMemo<AdminSessionValue>(
    () => ({ isAdmin, checked, login, logout }),
    [isAdmin, checked, login, logout]
  )

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  )
}

export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext)
  if (!ctx) {
    throw new Error('useAdminSession must be used within AdminSessionProvider')
  }
  return ctx
}

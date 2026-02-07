'use client'

import {
  createContext,
  useLayoutEffect,
  useContext,
  useMemo,
} from 'react'
import type { ReactNode } from 'react'
import type { ThemeContextValue } from '@/context/theme-types'
import {
  hydrateThemeStore,
  setThemeStore,
  toggleThemeStore,
  useThemeStore,
} from '@/lib/theme-store'

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore()

  useLayoutEffect(() => {
    hydrateThemeStore()
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeStore,
      toggleTheme: toggleThemeStore,
    }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

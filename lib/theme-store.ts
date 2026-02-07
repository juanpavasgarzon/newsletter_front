import { useSyncExternalStore } from 'react'
import type { Theme } from '@/context/theme-types'
import { appEnv } from '@/config/env'

const STORAGE_KEY = appEnv.themeStorageKey
const SERVER_SNAPSHOT: Theme = 'light'

let theme: Theme = SERVER_SNAPSHOT
const listeners = new Set<() => void>()

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return SERVER_SNAPSHOT
  }
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function syncThemeToDom(value: Theme): void {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem(STORAGE_KEY, value)
}

function notify(): void {
  listeners.forEach((listener) => {
    listener()
  })
}

function getSnapshot(): Theme {
  return theme
}

function getServerSnapshot(): Theme {
  return SERVER_SNAPSHOT
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function hydrateThemeStore(): void {
  const next = getStoredTheme()
  if (next !== theme) {
    theme = next
    notify()
  }
  syncThemeToDom(theme)
}

export function setThemeStore(value: Theme): void {
  theme = value
  syncThemeToDom(theme)
  notify()
}

export function toggleThemeStore(): void {
  theme = theme === 'light' ? 'dark' : 'light'
  syncThemeToDom(theme)
  notify()
}

export function useThemeStore(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

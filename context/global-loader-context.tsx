'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { PageLoader } from '@/components/PageLoader'
import { langFromPath } from '@/lib/lang-url'

const DEFAULT_DURATION_MS = 400

type GlobalLoaderContextValue = {
  triggerTransitionLoader: (ms?: number) => void
}

const GlobalLoaderContext = createContext<GlobalLoaderContextValue | null>(null)

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const { t } = useTranslation()
  const [showLoader, setShowLoader] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerTransitionLoader = useCallback((ms = DEFAULT_DURATION_MS) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowLoader(true)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      setShowLoader(false)
    }, ms)
  }, [])

  const lang =
    pathname.startsWith('/es') || pathname.startsWith('/en')
      ? langFromPath(pathname)
      : 'es'
  const label = t('common.loading', { lng: lang })

  return (
    <GlobalLoaderContext.Provider value={{ triggerTransitionLoader }}>
      {children}
      {showLoader && <PageLoader label={label} className="z-[60]" />}
    </GlobalLoaderContext.Provider>
  )
}

export function useGlobalLoader(): GlobalLoaderContextValue {
  const ctx = useContext(GlobalLoaderContext)
  if (!ctx) {
    throw new Error('useGlobalLoader must be used within GlobalLoaderProvider')
  }
  return ctx
}

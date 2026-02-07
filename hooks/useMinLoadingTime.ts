'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Returns true for at least `minMs` when `loading` is true,
 * so the loader is visible long enough and transitions feel less abrupt.
 */
export function useMinLoadingTime(loading: boolean, minMs = 400): boolean {
  const [showLoader, setShowLoader] = useState(loading)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (loading) {
      if (startRef.current === null) {
        startRef.current = Date.now()
      }
      setShowLoader(true)
      return
    }

    const start = startRef.current
    startRef.current = null
    if (start === null) {
      setShowLoader(false)
      return
    }

    const elapsed = Date.now() - start
    const remaining = Math.max(0, minMs - elapsed)
    const t = setTimeout(() => setShowLoader(false), remaining)
    return () => clearTimeout(t)
  }, [loading, minMs])

  return showLoader
}

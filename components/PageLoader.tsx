'use client'

import { Loader2 } from 'lucide-react'

export interface PageLoaderProps {
  label: string
  className?: string
}

export function PageLoader({ label, className = '' }: PageLoaderProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/20 backdrop-blur-md dark:bg-black/40 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Loader2
        className="text-primary h-10 w-10 animate-spin"
        aria-hidden
      />
      <p className="text-primary text-sm font-medium">{label}</p>
    </div>
  )
}

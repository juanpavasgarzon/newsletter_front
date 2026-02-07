'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ConfirmModalProps } from '@/contracts/components'

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  size = 'default',
  className,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className ?? ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/40"
        aria-label={cancelLabel}
      />
      <div
        className={`border-theme bg-surface-elevated relative rounded-2xl border shadow-xl ${size === 'wide' ? 'max-w-2xl' : 'max-w-xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10">
          <div className="mb-6 flex items-start gap-4">
            {isDanger && (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-red-500 dark:bg-red-500/15 dark:text-red-400"
                aria-hidden
              >
                <AlertTriangle className="h-6 w-6" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2
                id="confirm-modal-title"
                className="text-primary text-xl font-semibold"
              >
                {title}
              </h2>
              <p
                id="confirm-modal-desc"
                className="text-surface-muted mt-2 text-base leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="border-theme text-primary flex w-full items-center justify-center rounded-lg border bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted sm:w-auto"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={
                isDanger
                  ? 'bg-red-400/90 text-white flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors hover:bg-red-500/90 dark:bg-red-500/80 dark:hover:bg-red-500/90 sm:w-auto'
                  : 'bg-accent hover:bg-accent-hover text-white flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors sm:w-auto'
              }
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

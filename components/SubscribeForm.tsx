'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import type { SubscribeLang } from '@/features/newsletter/contracts/subscription'
import { useSubscribeMutation } from '@/features/newsletter/useSubscribeMutation'
import { ApiError } from '@/api/subscriptions'
import { fireFiestaConfetti } from '@/lib/confetti'
import { isValidEmail } from '@/lib/email'

export interface SubscribeFormProps {
  variant?: 'inline' | 'stacked'
  className?: string
  lang?: SubscribeLang
}

export function SubscribeForm({
  variant = 'stacked',
  className = '',
  lang = 'es',
}: SubscribeFormProps) {
  const { t } = useTranslation()
  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: lang })
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const mutation = useSubscribeMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !isValidEmail(trimmed)) {
      return
    }
    setSuccess(false)
    try {
      await mutation.mutateAsync({ email: trimmed, lang })
      setSuccess(true)
      setEmail('')
      toast.success(tLng('subscribe.success'))
      fireFiestaConfetti()
    } catch {
      setSuccess(false)
    }
  }

  const errorMessage = mutation.isError
    ? mutation.error instanceof ApiError
      ? mutation.error.status === 409
        ? tLng('subscribe.errorAlreadySubscribed')
        : mutation.error.message
      : tLng('subscribe.errorGeneric')
    : null

  if (success) {
    return (
      <p
        className={`text-accent text-sm font-medium ${className}`}
        role="status"
      >
        {tLng('subscribe.success')}
      </p>
    )
  }

  const langName = lang === 'es' ? tLng('admin.spanish') : tLng('admin.english')

  if (variant === 'inline') {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-wrap items-center gap-2 ${className}`}
      >
        <p className="text-surface-muted w-full text-xs">
          {tLng('subscribe.langHint', { langName })}
        </p>
        <div className="relative min-w-[200px] flex-1">
          <Mail className="text-surface-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={tLng('subscribe.placeholder')}
            required
            autoComplete="email"
            className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            aria-label={tLng('subscribe.label')}
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending || !email.trim()}
          className="bg-accent hover:bg-accent-hover text-white shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? tLng('subscribe.submitting') : tLng('subscribe.submit')}
        </button>
        {errorMessage && (
          <p className="text-surface-muted w-full text-xs" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-2 ${className}`}
    >
      <p className="text-surface-muted text-xs">
        {tLng('subscribe.langHint', { langName })}
      </p>
      <label htmlFor="subscribe-email" className="text-primary sr-only">
        {tLng('subscribe.label')}
      </label>
      <div className="relative">
        <Mail className="text-surface-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          id="subscribe-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={tLng('subscribe.placeholder')}
          required
          autoComplete="email"
          className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending || !email.trim()}
        className="bg-accent hover:bg-accent-hover text-white w-full rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50 sm:w-auto sm:px-6"
      >
        {mutation.isPending ? tLng('subscribe.submitting') : tLng('subscribe.submit')}
      </button>
      {errorMessage && (
        <p className="text-surface-muted text-xs" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

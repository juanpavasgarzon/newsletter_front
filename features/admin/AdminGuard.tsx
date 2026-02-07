'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import type { AdminGuardProps } from '@/features/admin/contracts'
import { useAdminSession } from '@/context/admin-session-context'
import { langFromPath } from '@/lib/lang-url'
import { useMinLoadingTime } from '@/hooks/useMinLoadingTime'
import { PageLoader } from '@/components/PageLoader'

const LOADER_MIN_MS = 400

export function AdminGuard({ children }: AdminGuardProps) {
  const { t } = useTranslation()
  const { isAdmin, checked } = useAdminSession()
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const lang =
    pathname.startsWith('/es') || pathname.startsWith('/en')
      ? langFromPath(pathname)
      : 'es'
  const showLoader = useMinLoadingTime(!checked, LOADER_MIN_MS)

  useEffect(() => {
    if (checked && !isAdmin) {
      router.replace(
        `/${lang}/login?redirect=${encodeURIComponent(pathname)}`
      )
    }
  }, [checked, isAdmin, lang, pathname, router])

  if (showLoader) {
    return <PageLoader label={t('common.verifying', { lng: lang })} />
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}

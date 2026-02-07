'use client'

import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { PageLoader } from '@/components/PageLoader'
import { langFromPath } from '@/lib/lang-url'

/**
 * Shown by Next.js during route transitions (navigation and language change).
 */
export default function LangLoading() {
  const pathname = usePathname() ?? ''
  const { t } = useTranslation()
  const lang =
    pathname.startsWith('/es') || pathname.startsWith('/en')
      ? langFromPath(pathname)
      : 'es'
  return <PageLoader label={t('common.loading', { lng: lang })} />
}

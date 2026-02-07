'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import {
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PenSquare,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme-context'
import { useGlobalLoader } from '@/context/global-loader-context'
import { useAdminSession } from '@/context/admin-session-context'
import {
  useBasicInfoQuery,
  useLogoQuery,
} from '@/features/site/useSiteConfigQuery'
import { currentLangFromLocation, pathWithLang } from '@/lib/lang-url'
import { setStoredLanguage } from '@/lib/i18n-client'
import { ConfirmModal } from '@/components/ConfirmModal'

export function NewsletterHeader() {
  const { t, i18n } = useTranslation()
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { triggerTransitionLoader } = useGlobalLoader()
  const { isAdmin, logout } = useAdminSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const logoutCloseMenuRef = useRef<(() => void) | null>(null)
  const currentLang = currentLangFromLocation(pathname, i18n.language)
  const { data: basicInfo } = useBasicInfoQuery(currentLang)
  const { data: logoData } = useLogoQuery()
  const isEn = currentLang === 'en'

  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: currentLang })

  const openLogoutModal = (closeMenu?: () => void) => {
    logoutCloseMenuRef.current = closeMenu ?? null
    setLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    logout()
    logoutCloseMenuRef.current?.()
    logoutCloseMenuRef.current = null
    setLogoutModalOpen(false)
  }

  const cancelLogout = () => {
    logoutCloseMenuRef.current = null
    setLogoutModalOpen(false)
  }

  const goToLang = (lang: 'es' | 'en') => {
    setMenuOpen(false)
    triggerTransitionLoader()
    setStoredLanguage(lang).then(() => {
      const path = pathWithLang(pathname, lang)
      router.push(path)
    })
  }

  const logoUrl = logoData?.logoUrl
  const subscriberCount = basicInfo?.subscriberCount

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [menuOpen])

  const articlesPath = `/${currentLang}/articles`
  const isArticlesSection =
    pathname === articlesPath || pathname.startsWith(articlesPath + '/')

  const linkClass = (path: string, isArticles = false) => {
    const base =
      'text-primary rounded-lg px-3 py-2 text-sm font-medium transition-colors'
    const active = isArticles
      ? isArticlesSection
      : pathname === path || pathname.startsWith(path + '/')
    const activeStyle = active ? 'bg-accent-muted text-accent' : 'hover:bg-surface-muted'
    return `${base} ${activeStyle}`
  }

  const mobileLinkClass = (path: string, isArticles = false) => {
    const base =
      'text-primary flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 font-medium touch-manipulation'
    const active = isArticles
      ? isArticlesSection
      : pathname === path || pathname.startsWith(path + '/')
    const activeStyle = active
      ? 'bg-accent-muted text-accent'
      : 'hover:bg-surface-muted active:bg-surface-muted'
    return `${base} ${activeStyle}`
  }

  return (
    <header className="sticky top-0 z-40 border-theme border-b bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={articlesPath}
          className="text-primary flex shrink-0 items-center gap-2 font-semibold transition-opacity hover:opacity-90"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-accent text-xl font-bold">
              Pavas Newsletter
            </span>
          )}
          <span className="hidden sm:inline">{tLng('common.newsletter')}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href={`/${currentLang}/about`}
            className={linkClass(`/${currentLang}/about`)}
          >
            {tLng('common.about')}
          </Link>
          <Link
            href={articlesPath}
            className={linkClass(articlesPath, true)}
          >
            {tLng('common.articles')}
          </Link>
          {isAdmin && (
            <>
              <Link
                href={`/${currentLang}/admin/articles`}
                className={linkClass(`/${currentLang}/admin/articles`)}
              >
                {tLng('admin.publishedArticles')}
              </Link>
              <Link
                href={`/${currentLang}/admin/subscribers`}
                className={linkClass(`/${currentLang}/admin/subscribers`)}
              >
                {tLng('admin.subscribersList')}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="text-primary border-theme flex rounded-lg border bg-surface-muted/50 p-0.5 text-sm">
            <button
              type="button"
              onClick={() => goToLang('es')}
              className={`rounded-md px-2 py-1 transition-colors ${
                !isEn ? 'bg-accent text-white' : 'hover:bg-surface-muted'
              }`}
              aria-label="Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => goToLang('en')}
              className={`rounded-md px-2 py-1 transition-colors ${
                isEn ? 'bg-accent text-white' : 'hover:bg-surface-muted'
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerTransitionLoader()
              toggleTheme()
            }}
            className="text-primary rounded-lg p-2 transition-colors hover:bg-surface-muted"
            aria-label={
              theme === 'dark' ? tLng('common.themeLight') : tLng('common.themeDark')
            }
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {isAdmin ? (
          <button
            type="button"
            onClick={() => openLogoutModal()}
            className="text-primary hidden rounded-lg p-2 transition-colors hover:bg-surface-muted lg:block"
              aria-label={tLng('common.logout')}
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href={`/${currentLang}/login`}
              className="text-primary hidden rounded-lg p-2 transition-colors hover:bg-surface-muted lg:flex"
              aria-label={tLng('common.login')}
            >
              <LogIn className="h-5 w-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="text-primary rounded-lg p-2 transition-colors hover:bg-surface-muted lg:hidden"
            aria-label={tLng('common.openMenu')}
          >
            <Menu className="h-5 w-5" />
          </button>

          {typeof subscriberCount === 'number' && (
            <span
              className="bg-accent-muted text-accent hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium lg:inline-flex"
              title={tLng('common.subscribers', { count: subscriberCount })}
            >
              {tLng('common.subscribers', { count: subscriberCount })}
            </span>
          )}
        </div>
      </div>

      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={tLng('common.menu')}
          >
            <div
              className="absolute inset-0 bg-black/50"
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div className="mobile-drawer-panel absolute inset-0 z-10 flex flex-col overflow-auto border-theme border-t shadow-2xl">
              <div className="flex h-14 shrink-0 items-center justify-between border-theme border-b px-4">
                <span className="text-primary font-semibold">
                  {tLng('common.menu')}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="text-primary rounded-lg p-2 hover:bg-surface-muted"
                  aria-label={tLng('common.closeMenu')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 p-4">
                <Link
                  href={`/${currentLang}/about`}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass(`/${currentLang}/about`)}
                >
                  <User className="h-5 w-5 shrink-0" />
                  <span>{tLng('common.about')}</span>
                </Link>
                <Link
                  href={articlesPath}
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass(articlesPath, true)}
                >
                  <BookOpen className="h-5 w-5 shrink-0" />
                  <span>{tLng('common.articles')}</span>
                </Link>
                {isAdmin ? (
                  <>
                    <Link
                      href={`/${currentLang}/admin/articles`}
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass(
                        `/${currentLang}/admin/articles`
                      )}
                    >
                      <PenSquare className="h-5 w-5 shrink-0" />
                      <span>{tLng('admin.publishedArticles')}</span>
                    </Link>
                    <Link
                      href={`/${currentLang}/admin/subscribers`}
                      onClick={() => setMenuOpen(false)}
                      className={mobileLinkClass(
                        `/${currentLang}/admin/subscribers`
                      )}
                    >
                      <Users className="h-5 w-5 shrink-0" />
                      <span>{tLng('admin.subscribersList')}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => openLogoutModal(() => setMenuOpen(false))}
                      className="text-primary flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-surface-muted"
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                      <span>{tLng('common.logout')}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${currentLang}/login`}
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass(`/${currentLang}/login`)}
                  >
                    <LogIn className="h-5 w-5 shrink-0" />
                    <span>{tLng('common.login')}</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}

      {logoutModalOpen &&
        createPortal(
          <ConfirmModal
            open={logoutModalOpen}
            title={tLng('common.logout')}
            message={tLng('common.logoutConfirmDescription')}
            confirmLabel={tLng('common.logout')}
            cancelLabel={tLng('common.cancel')}
            variant="default"
            size="wide"
            className="z-[110]"
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
          />,
          document.body
        )}
    </header>
  )
}

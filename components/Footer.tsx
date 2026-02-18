'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, MapPin, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SubscribeForm } from '@/components/SubscribeForm'
import { useBasicInfoQuery } from '@/features/site/useSiteConfigQuery'
import { currentLangFromLocation } from '@/lib/lang-url'
import { experienceYears } from '@/lib/date-utils'

export function Footer() {
  const { t, i18n } = useTranslation()
  const pathname = usePathname() ?? ''
  const lang = currentLangFromLocation(pathname, i18n.language)
  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: lang })
  const { data: basicInfo } = useBasicInfoQuery(lang)
  const author = basicInfo

  return (
    <footer className="border-theme mt-auto border-t bg-surface-elevated">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {author?.name ? (
            <section>
              <h3 className="text-primary mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                <Image
                  src="/Pavas-logo-transparent.png"
                  alt=""
                  width={80}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
                {tLng('footer.author')}
              </h3>
              <p className="text-primary font-medium">{author.name}</p>
              {author.role ? (
                <p className="text-surface-muted text-sm">{author.role}</p>
              ) : null}
              <p className="text-accent mt-1 text-sm font-medium">
                {tLng('footer.experience', {
                  years: experienceYears(author.startYear),
                })}
              </p>
              {author.city || author.country ? (
                <p className="text-surface-muted mt-2 flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {[author.city, author.country].filter(Boolean).join(', ')}
                </p>
              ) : null}
              {author.github || author.linkedin ? (
                <div className="mt-4 flex gap-3">
                  {author.github ? (
                    <a
                      href={author.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-surface-muted hover:text-accent rounded-lg p-2 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  ) : null}
                  {author.linkedin ? (
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-surface-muted hover:text-accent rounded-lg p-2 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
          <section>
            <h3 className="text-primary mb-4 text-sm font-semibold uppercase tracking-wider">
              {tLng('footer.subscribeTitle')}
            </h3>
            <p className="text-surface-muted mb-3 text-sm leading-relaxed">
              {tLng('footer.appDescription')}
            </p>
            <SubscribeForm variant="stacked" lang={lang} />
          </section>
        </div>
        <div className="border-theme mt-10 border-t pt-6 text-center">
          <p className="text-surface-muted text-xs">
            © {new Date().getFullYear()} Pavas Newsletter
            {author?.name ? ` · ${author.name}` : ''}
          </p>
        </div>
      </div>
    </footer>
  )
}

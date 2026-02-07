'use client'

import { isSupportedLang, PRIMARY_LANG } from '@/config/i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const STORAGE_KEY = 'newsletter-lang'


if (!i18n.isInitialized) {
  let initialLng = PRIMARY_LANG

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) ?? ''
      if (isSupportedLang(saved)) {
        initialLng = saved
      }
    } catch (error) {
      console.error('Error getting stored language:', error)
    }
  }

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en as Record<string, unknown> },
        es: { translation: es as Record<string, unknown> },
      },
      lng: initialLng,
      fallbackLng: PRIMARY_LANG,
      supportedLngs: ['es', 'en'],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
}

export async function setStoredLanguage(
  lng: import('@/config/i18n').SupportedLang,
): Promise<void> {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
  await i18n.changeLanguage(lng)
}

export default i18n

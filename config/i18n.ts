export const SUPPORTED_LANGS = ['es', 'en'] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]
export const PRIMARY_LANG: SupportedLang = 'es'

export function isSupportedLang(lng: string): lng is SupportedLang {
  return (SUPPORTED_LANGS as ReadonlyArray<string>).includes(lng)
}

const STORAGE_KEY = 'newsletter-lang'

export function getStoredLanguage(): SupportedLang {
  if (typeof window === 'undefined') {
    return PRIMARY_LANG
  }
  const saved = localStorage.getItem(STORAGE_KEY) ?? ''
  return isSupportedLang(saved) ? saved : PRIMARY_LANG
}

export function getLocaleForDates(lng?: string): string {
  return lng === 'en' ? 'en-US' : 'es-ES'
}

export function pathWithLang(pathname: string, lang: 'es' | 'en'): string {
  const withoutLeading = pathname.replace(/^\//, '')
  const segments = withoutLeading.split('/').filter(Boolean)
  if (segments[0] === 'es' || segments[0] === 'en') {
    segments[0] = lang
    return `/${segments.join('/')}`
  }
  return segments.length > 0 ? `/${lang}/${withoutLeading}` : `/${lang}`
}

export function langFromPath(pathname: string): 'es' | 'en' {
  const first = pathname.replace(/^\//, '').split('/')[0]
  return first === 'en' ? 'en' : 'es'
}

export function currentLangFromLocation(
  pathname: string,
  i18nLanguage: string,
): 'es' | 'en' {
  if (pathname.startsWith('/es') || pathname.startsWith('/en')) {
    return langFromPath(pathname)
  }
  return i18nLanguage === 'en' ? 'en' : 'es'
}

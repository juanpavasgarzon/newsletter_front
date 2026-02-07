function readEnv(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }
  const trimmed = value.trim()
  if (trimmed === '') {
    return ''
  }
  return trimmed
}

export const appEnv = {
  apiBaseUrl: readEnv(
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_APP_API_URL : '',
  ).replace(/\/$/, ''),
  adminSessionKey: readEnv(
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_APP_ADMIN_SESSION_KEY
      : '',
  ),
  themeStorageKey:
    readEnv(
      typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_APP_THEME_STORAGE_KEY
        : '',
    ) || 'newsletter-theme',
  enableAnalytics: readEnv(
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_ENABLE_ANALYTICS
      : '',
  ) === 'true',
} as const

import { useQuery } from '@tanstack/react-query'
import type { SupportedLang } from '@/config/i18n'
import type { ConfigLang } from '@/api/site'
import { fetchAbout, fetchBasicInfo, fetchLogo } from '@/api/site'

const STALE_TIME_MS = 1000 * 60 * 5

export const siteKeys = {
  basicInfo: (lang?: ConfigLang) => ['site', 'basic-info', lang] as const,
  logo: () => ['site', 'logo'] as const,
  about: (lang?: ConfigLang) => ['site', 'about', lang] as const,
}

export function useBasicInfoQuery(lang?: SupportedLang) {
  return useQuery({
    queryKey: siteKeys.basicInfo(lang),
    queryFn: () => fetchBasicInfo(lang),
    staleTime: STALE_TIME_MS,
  })
}

export function useLogoQuery() {
  return useQuery({
    queryKey: siteKeys.logo(),
    queryFn: () => fetchLogo(),
    staleTime: STALE_TIME_MS,
  })
}

export function useAboutQuery(lang?: SupportedLang) {
  return useQuery({
    queryKey: siteKeys.about(lang),
    queryFn: () => fetchAbout(lang),
    staleTime: STALE_TIME_MS,
  })
}

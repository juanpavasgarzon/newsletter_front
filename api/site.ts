import type {
  AboutResponse,
  AboutSection,
  BasicInfo,
  ConfigLang,
  LogoResponse,
} from '@/features/site/contracts'
import { ensureApiUrl } from '@/lib/api-url'
import {
  logOutgoingRequest,
  logOutgoingResponse,
} from '@/lib/request-log'
import { parseJson, safeNumber, safeString } from '@/lib/safe-parse'

export type { ConfigLang }

function buildConfigQuery(lang?: ConfigLang): string {
  if (!lang) {
    return ''
  }
  return `?lang=${encodeURIComponent(lang)}`
}

export async function fetchBasicInfo(
  lang?: ConfigLang,
): Promise<BasicInfo | null> {
  try {
    const base = ensureApiUrl()
    const query = buildConfigQuery(lang)
    const url = `${base}/config/basic-info${query}`
    logOutgoingRequest({ method: 'GET', url })
    const start = Date.now()
    const res = await fetch(url)
    logOutgoingResponse({
      method: 'GET',
      url,
      status: res.status,
      durationMs: Date.now() - start,
    })
    const text = await res.text()
    if (!res.ok) {
      return null
    }
    const data = parseJson<Record<string, unknown>>(text)
    if (!data || typeof data !== 'object') {
      return null
    }
    const name = safeString(data.name)
    return {
      name,
      role: safeString(data.role),
      startYear: safeNumber(data.startYear, 1900, new Date().getFullYear()),
      github: safeString(data.github),
      linkedin: safeString(data.linkedin),
      country: safeString(data.country),
      city: safeString(data.city),
      subscriberCount:
        typeof data.subscriberCount === 'number' && data.subscriberCount >= 0
          ? data.subscriberCount
          : undefined,
    }
  } catch {
    return null
  }
}

export async function fetchLogo(): Promise<LogoResponse | null> {
  try {
    const base = ensureApiUrl()
    const url = `${base}/config/logo`
    logOutgoingRequest({ method: 'GET', url })
    const start = Date.now()
    const res = await fetch(url)
    logOutgoingResponse({
      method: 'GET',
      url,
      status: res.status,
      durationMs: Date.now() - start,
    })
    const text = await res.text()
    if (!res.ok) {
      return null
    }
    const data = parseJson<{ logoUrl?: unknown }>(text)
    if (!data || typeof data !== 'object') {
      return null
    }
    const logoUrl =
      typeof data.logoUrl === 'string' && data.logoUrl.trim() !== ''
        ? data.logoUrl.trim()
        : ''
    return logoUrl ? { logoUrl } : null
  } catch {
    return null
  }
}

function parseSections(val: unknown): Array<AboutSection> {
  if (!Array.isArray(val)) {
    return []
  }
  return val
    .map((item) => {
      if (
        item &&
        typeof item === 'object' &&
        'title' in item &&
        'content' in item
      ) {
        return {
          title: safeString(item.title),
          content: safeString(item.content),
        }
      }
      return null
    })
    .filter((s): s is AboutSection => s !== null)
}

export async function fetchAbout(
  lang?: ConfigLang,
): Promise<AboutResponse | null> {
  try {
    const base = ensureApiUrl()
    const query = buildConfigQuery(lang)
    const url = `${base}/config/about${query}`
    logOutgoingRequest({ method: 'GET', url })
    const start = Date.now()
    const res = await fetch(url)
    logOutgoingResponse({
      method: 'GET',
      url,
      status: res.status,
      durationMs: Date.now() - start,
    })
    const text = await res.text()
    if (!res.ok) {
      return null
    }
    const data = parseJson<Record<string, unknown>>(text)
    if (!data || typeof data !== 'object') {
      return null
    }
    return {
      title: safeString(data.title),
      subtitle: safeString(data.subtitle),
      sections: parseSections(data.sections),
    }
  } catch {
    return null
  }
}

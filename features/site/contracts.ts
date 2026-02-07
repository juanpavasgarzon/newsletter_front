export type ConfigLang = 'es' | 'en'

export interface BasicInfo {
  name: string
  role: string
  startYear: number
  github: string
  linkedin: string
  country: string
  city: string
  subscriberCount?: number
}

export interface LogoResponse {
  logoUrl: string
}

export interface AboutSection {
  title: string
  content: string
}

export interface AboutResponse {
  title: string
  subtitle: string
  sections: Array<AboutSection>
}

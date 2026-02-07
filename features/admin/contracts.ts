import type { ReactNode } from 'react'

export interface AdminSearchParams {
  redirect?: string
  q?: string
}

export interface AdminGuardProps {
  children: ReactNode
}

export interface LoginInput {
  secret: string
}

export interface LoginResult {
  token: string
  expiresAt?: string
}

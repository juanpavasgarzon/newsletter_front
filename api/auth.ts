import type { LoginInput, LoginResult } from '@/features/admin/contracts'
import { clearToken, getToken, setToken } from '@/lib/auth-token'
import { request } from '@/api/client'

export { ApiError } from '@/api/client'

export async function login(input: LoginInput): Promise<LoginResult> {
  const result = await request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  setToken(result.token)
  return result
}

export function logout(): void {
  clearToken()
}

export { getToken, setToken, clearToken }

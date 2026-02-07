import type {
  FetchSubscribersParams,
  SubscribeInput,
  SubscribeResult,
  SubscriberCountResponse,
  SubscriberEmailsResponse,
  SubscribersListResponse,
  UnsubscribeInput,
  UnsubscribeResult,
} from '@/features/newsletter/contracts/subscription'
import { request } from '@/api/client'

export { ApiError } from '@/api/client'

export async function subscribe(
  input: SubscribeInput,
): Promise<SubscribeResult> {
  return request<SubscribeResult>('/subscribe', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function unsubscribePost(
  input: UnsubscribeInput,
): Promise<UnsubscribeResult> {
  return request<UnsubscribeResult>('/subscribe/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email: input.email.trim().toLowerCase() }),
    authenticated: true,
  })
}

export async function unsubscribePostPublic(
  input: UnsubscribeInput,
): Promise<UnsubscribeResult> {
  return request<UnsubscribeResult>('/subscribe/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email: input.email.trim().toLowerCase() }),
    authenticated: false,
  })
}

export async function unsubscribeGet(email: string): Promise<UnsubscribeResult> {
  const q = new URLSearchParams({
    email: email.trim().toLowerCase(),
  })
  return request<UnsubscribeResult>(`/subscribe/unsubscribe?${q.toString()}`, {
    authenticated: false,
  })
}

export async function fetchSubscribers(
  params: FetchSubscribersParams = {},
): Promise<SubscribersListResponse> {
  const sp = new URLSearchParams()
  if (params.cursor) sp.set('cursor', params.cursor)
  if (params.limit != null) sp.set('limit', String(params.limit))
  const query = sp.toString()
  return request<SubscribersListResponse>(
    `/subscribe${query ? `?${query}` : ''}`,
    { authenticated: true },
  )
}

export async function fetchSubscriberCount(): Promise<SubscriberCountResponse> {
  return request<SubscriberCountResponse>('/subscribe/count', {
    authenticated: true,
  })
}

export async function fetchSubscriberEmails(): Promise<SubscriberEmailsResponse> {
  return request<SubscriberEmailsResponse>('/subscribe/emails', {
    authenticated: true,
  })
}

export type SubscribeLang = 'es' | 'en'

export interface SubscribeInput {
  email: string
  lang?: SubscribeLang
}

export interface SubscribeMutationInput {
  email: string
  lang?: SubscribeLang
}

export interface FetchSubscribersParams {
  cursor?: string
  limit?: number
}

export interface SubscribeResult {
  ok: boolean
  message?: string
}

export interface Subscriber {
  id: string
  email: string
  lang: string
  createdAt: string
}

export interface SubscribersListResponse {
  items: Array<Subscriber>
  nextCursor?: string
}

export interface SubscriberCountResponse {
  count: number
}

export interface SubscriberEmailsResponse {
  emails: Array<string>
}

export interface UnsubscribeInput {
  email: string
}

export interface UnsubscribeResult {
  ok: boolean
}
